import type { ResourceSubtype, GroupSubtype } from '../types/aws';

export interface TfResource {
  address: string;
  type: string;
  name: string;
  provider_name: string;
  values?: Record<string, unknown>;
}

export interface TfConfigResource {
  address: string;
  expressions?: Record<string, { references?: string[] }>;
  depends_on?: string[];
}

export interface TfPlan {
  variables?: Record<string, { value: unknown }>;
  planned_values: {
    root_module: {
      resources?: TfResource[];
      child_modules?: TfModule[];
    };
  };
  configuration?: {
    root_module?: {
      resources?: TfConfigResource[];
      module_calls?: Record<string, { module?: { resources?: TfConfigResource[] } }>;
    };
  };
}

interface TfModule {
  address: string;
  resources?: TfResource[];
  child_modules?: TfModule[];
}

export interface NodeMeta {
  tfType: string;
  tfName: string;
  address: string;
  subtype: ResourceSubtype;
  label: string;
  shortLabel: string;
}

export interface GroupMeta {
  subtype: GroupSubtype;
  label: string;
  shortLabel: string;
  // Optional hint for ELK INTERACTIVE positioning (0 = top, higher = further down).
  layerHint?: number;
}

// Resource types omitted entirely from the diagram.
const EXCLUDED_TYPES = new Set([
  'aws_route_table',
  'aws_route_table_association',
  'aws_db_subnet_group',
]);

// Maps terraform resource types that aren't in icons.json to the closest available type.
const SUBTYPE_FALLBACK: Record<string, ResourceSubtype> = {
  aws_security_group: 'aws_networkfirewall_firewall',
  aws_lb_listener: 'aws_lb',
  aws_lb_target_group: 'aws_lb',
  aws_lb_listener_rule: 'aws_lb',
  aws_iam_role_policy_attachment: 'aws_iam_role',
  aws_iam_instance_profile: 'aws_iam_role',
  aws_autoscaling_group: 'aws_instance',
  aws_launch_template: 'aws_instance',
};

// Resource types that become group containers rather than resource nodes.
const GROUP_RESOURCE_TYPES: Record<string, GroupSubtype> = {
  aws_vpc: 'vpc',
  aws_subnet: 'subnet',
};

// Friendly display name for well-known AWS regions.
const REGION_DISPLAY_NAMES: Record<string, string> = {
  'us-east-1': 'US East (N. Virginia)',
  'us-east-2': 'US East (Ohio)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'eu-west-1': 'EU (Ireland)',
  'eu-west-2': 'EU (London)',
  'eu-central-1': 'EU (Frankfurt)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
  'ap-southeast-2': 'Asia Pacific (Sydney)',
  'ap-northeast-1': 'Asia Pacific (Tokyo)',
  'sa-east-1': 'South America (São Paulo)',
};

export class CompoundGraph {
  readonly nodes = new Map<string, NodeMeta>();
  readonly groups = new Map<string, GroupMeta>();
  readonly edges: Array<[string, string]> = [];
  readonly parentOf = new Map<string, string>(); // childId → parentGroupId

  addNode(id: string, meta: NodeMeta) { this.nodes.set(id, meta); }
  addGroup(id: string, meta: GroupMeta) { this.groups.set(id, meta); }
  addEdge(source: string, target: string) { this.edges.push([source, target]); }
  setParent(childId: string, parentGroupId: string) { this.parentOf.set(childId, parentGroupId); }
}

function resolveSubtype(tfType: string): ResourceSubtype {
  if (tfType in SUBTYPE_FALLBACK) return SUBTYPE_FALLBACK[tfType];
  return tfType as ResourceSubtype;
}

function collectEdges(
  configModule: NonNullable<TfPlan['configuration']>['root_module'],
  graph: CompoundGraph,
) {
  if (!configModule) return;
  for (const res of configModule.resources ?? []) {
    for (const exprVal of Object.values(res.expressions ?? {})) {
      for (const ref of exprVal.references ?? []) {
        if (ref.startsWith('var.') || ref.startsWith('data.') || ref.startsWith('local.')) continue;
        const parts = ref.split('.');
        const targetAddress = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : ref;
        if (targetAddress === res.address) continue;
        if (graph.nodes.has(res.address) && graph.nodes.has(targetAddress)) {
          graph.addEdge(res.address, targetAddress);
        }
      }
    }
    for (const dep of res.depends_on ?? []) {
      if (graph.nodes.has(res.address) && graph.nodes.has(dep)) {
        graph.addEdge(res.address, dep);
      }
    }
  }
}

export function parseTfPlan(plan: TfPlan): CompoundGraph {
  const graph = new CompoundGraph();
  const resources = plan.planned_values.root_module.resources ?? [];

  // ── Step 1: Determine region ──────────────────────────────────────────────
  const region = String(plan.variables?.['aws_region']?.value ?? 'us-east-1');
  const regionId = `region-${region}`;
  graph.addGroup(regionId, {
    subtype: 'region',
    label: REGION_DISPLAY_NAMES[region] ?? region,
    shortLabel: region,
  });

  // ── Step 2: Collect VPCs ──────────────────────────────────────────────────
  const vpcResources = resources.filter(r => r.type === 'aws_vpc');
  for (const vpc of vpcResources) {
    const cidr = String(vpc.values?.['cidr_block'] ?? '');
    const label = cidr ? `${vpc.name}  ${cidr}` : vpc.name;
    graph.addGroup(vpc.address, { subtype: 'vpc', label, shortLabel: vpc.name });
    graph.setParent(vpc.address, regionId);
  }

  // ── Step 3: Build ref map ─────────────────────────────────────────────────
  const configResources = plan.configuration?.root_module?.resources ?? [];
  const nodeRefs = new Map<string, Set<string>>();
  for (const cfgRes of configResources) {
    const refs = new Set<string>();
    for (const exprVal of Object.values(cfgRes.expressions ?? {})) {
      for (const ref of exprVal.references ?? []) {
        if (ref.startsWith('var.') || ref.startsWith('data.') || ref.startsWith('local.')) continue;
        const parts = ref.split('.');
        if (parts.length >= 2) refs.add(`${parts[0]}.${parts[1]}`);
      }
    }
    nodeRefs.set(cfgRes.address, refs);
  }

  const vpcAddresses = vpcResources.map(v => v.address);
  const subnetResources = resources.filter(r => r.type === 'aws_subnet');

  // ── Step 4: Derive AZ groups from subnet availability_zone data ───────────
  const azGroupIds = new Map<string, string>(); // "vpcAddr|azName" → azGroupId

  for (const subnet of subnetResources) {
    const refs = nodeRefs.get(subnet.address) ?? new Set();
    const parentVpcAddr = vpcAddresses.find(v => refs.has(v)) ?? vpcAddresses[0] ?? regionId;
    const az = String(subnet.values?.['availability_zone'] ?? '');
    const azKey = `${parentVpcAddr}|${az}`;

    if (az && !azGroupIds.has(azKey)) {
      const azId = `az-${az}-in-${parentVpcAddr}`;
      azGroupIds.set(azKey, azId);
      graph.addGroup(azId, { subtype: 'az', label: az, shortLabel: az });
      graph.setParent(azId, parentVpcAddr);
    }
  }

  // ── Step 5: Add subnet groups inside their AZ ─────────────────────────────
  for (const subnet of subnetResources) {
    const refs = nodeRefs.get(subnet.address) ?? new Set();
    const parentVpcAddr = vpcAddresses.find(v => refs.has(v)) ?? vpcAddresses[0] ?? regionId;
    const az = String(subnet.values?.['availability_zone'] ?? '');
    const azKey = `${parentVpcAddr}|${az}`;
    const parentId = az ? azGroupIds.get(azKey)! : parentVpcAddr;

    const cidr = String(subnet.values?.['cidr_block'] ?? '');
    const isPublic = subnet.values?.['map_public_ip_on_launch'] === true;
    const subnetLabel = cidr ? `${subnet.name}  ${cidr}` : subnet.name;
    graph.addGroup(subnet.address, {
      subtype: 'subnet',
      label: subnetLabel,
      shortLabel: subnet.name,
      layerHint: isPublic ? 0 : 1,
    });
    graph.setParent(subnet.address, parentId);
  }

  // ── Step 6: Place leaf resources (skip excluded and group types) ───────────
  const skippedTypes = new Set([...EXCLUDED_TYPES, ...Object.keys(GROUP_RESOURCE_TYPES)]);
  const subnetAddresses = subnetResources.map(s => s.address);

  // Build lookup: AZ name → azGroupId (across all VPCs — fine for single-VPC plans)
  const azByName = new Map<string, string>();
  for (const [azKey, azId] of azGroupIds) {
    const azName = azKey.split('|')[1];
    if (azName) azByName.set(azName, azId);
  }

  for (const res of resources.filter(r => !skippedTypes.has(r.type))) {
    const compactType = res.type.replace(/^aws_/, '');
    graph.addNode(res.address, {
      tfType: res.type,
      tfName: res.name,
      address: res.address,
      subtype: resolveSubtype(res.type),
      label: `${res.type}.${res.name}`,
      shortLabel: `${res.name}\n${compactType}`,
    });

    const refs = nodeRefs.get(res.address) ?? new Set();

    // 1. Resource has an explicit availability_zone value → place in that AZ's subnet(s).
    const resAz = res.values?.['availability_zone'];
    if (typeof resAz === 'string' && resAz) {
      // Find subnets in that AZ that this resource references (prefer specific subnet).
      const subnetsInAz = subnetResources
        .filter(s => s.values?.['availability_zone'] === resAz)
        .map(s => s.address);
      const matchedSubnet = subnetsInAz.find(s => refs.has(s));
      if (matchedSubnet) {
        graph.setParent(res.address, matchedSubnet);
        continue;
      }
      // No direct subnet ref but AZ is known → place in first subnet in that AZ.
      if (subnetsInAz.length > 0) {
        graph.setParent(res.address, subnetsInAz[0]);
        continue;
      }
      // AZ group exists but no subnet → place in the AZ group.
      const azId = azByName.get(resAz);
      if (azId) {
        graph.setParent(res.address, azId);
        continue;
      }
    }

    // 2. Single referenced subnet → place in that subnet.
    const referencedSubnets = subnetAddresses.filter(s => refs.has(s));
    if (referencedSubnets.length === 1) {
      graph.setParent(res.address, referencedSubnets[0]);
      continue;
    }

    // 3. Referenced VPC → place at VPC level.
    const referencedVpcs = vpcAddresses.filter(v => refs.has(v));
    if (referencedVpcs.length >= 1) {
      graph.setParent(res.address, referencedVpcs[0]);
      continue;
    }

    graph.setParent(res.address, vpcAddresses[0] ?? regionId);
  }

  // ── Step 7: Handle Terraform child modules as group containers ─────────────
  for (const mod of plan.planned_values.root_module.child_modules ?? []) {
    const parts = mod.address.split('.');
    const modName = parts[parts.length - 1];
    graph.addGroup(mod.address, { subtype: 'subnet', label: mod.address, shortLabel: modName });
    graph.setParent(mod.address, vpcAddresses[0] ?? regionId);

    for (const res of mod.resources ?? []) {
      if (skippedTypes.has(res.type)) continue;
      const compactType = res.type.replace(/^aws_/, '');
      graph.addNode(res.address, {
        tfType: res.type,
        tfName: res.name,
        address: res.address,
        subtype: resolveSubtype(res.type),
        label: `${res.type}.${res.name}`,
        shortLabel: `${res.name}\n${compactType}`,
      });
      graph.setParent(res.address, mod.address);
    }
  }

  // ── Step 8: Build edges (resource → resource only) ─────────────────────────
  collectEdges(plan.configuration?.root_module, graph);

  // Deduplicate edges
  const seen = new Set<string>();
  const deduped: Array<[string, string]> = [];
  for (const [src, tgt] of graph.edges) {
    const key = `${src}→${tgt}`;
    if (!seen.has(key)) { seen.add(key); deduped.push([src, tgt]); }
  }
  graph.edges.length = 0;
  graph.edges.push(...deduped);

  // ── Step 9: Remove empty groups (bottom-up, repeated until stable) ────────
  let changed = true;
  while (changed) {
    changed = false;
    for (const [groupId] of [...graph.groups]) {
      const hasChildNode = [...graph.nodes.keys()].some(id => graph.parentOf.get(id) === groupId);
      const hasChildGroup = [...graph.groups.keys()].some(id => graph.parentOf.get(id) === groupId);
      if (!hasChildNode && !hasChildGroup) {
        graph.groups.delete(groupId);
        graph.parentOf.delete(groupId);
        changed = true;
      }
    }
  }

  return graph;
}
