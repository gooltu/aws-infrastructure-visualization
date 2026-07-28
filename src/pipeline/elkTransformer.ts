import type { ElkNode, ElkExtendedEdge } from 'elkjs';
import type { CompoundGraph } from './CompoundGraph';
import type { GraphSettings } from '../settings/types';
import { RESOURCE_NODE_WIDTH, RESOURCE_NODE_HEIGHT, ELK_GROUP_OPTIONS } from './config';

const ELK_ROOT_OPTIONS: Record<string, string> = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.spacing.nodeNode': '60',
  'elk.padding': '[top=50,left=50,bottom=50,right=50]',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.layered.layering.strategy': 'INTERACTIVE',
};

// Returns the tier index (0 = top) for a given terraform resource type,
// or null if not matched to any tier.
function getTierIndex(tfType: string, settings: GraphSettings): number | null {
  for (let i = 0; i < settings.tiers.length; i++) {
    if (settings.tiers[i].resourceTypes.includes(tfType)) return i;
  }
  return null;
}

function buildElkChildren(
  parentId: string | null,
  graph: CompoundGraph,
  builtGroups: Set<string>,
  settings: GraphSettings,
): ElkNode[] {
  const children: ElkNode[] = [];
  const tierCount = settings.tiers.length;
  // Space tiers far apart so INTERACTIVE strategy assigns distinct layers.
  const tierSpacing = 2000;

  for (const [groupId, groupMeta] of graph.groups) {
    const groupParent = graph.parentOf.get(groupId) ?? null;
    if (groupParent !== parentId) continue;
    if (builtGroups.has(groupId)) continue;
    builtGroups.add(groupId);

    const groupChildren = buildElkChildren(groupId, graph, builtGroups, settings);

    // Apply layerHint for subnet ordering when the setting is enabled.
    const useHint = settings.publicSubnetsFirst && groupMeta.layerHint !== undefined;
    const yHint = useHint ? groupMeta.layerHint! * tierSpacing : undefined;

    children.push({
      id: groupId,
      layoutOptions: ELK_GROUP_OPTIONS,
      children: groupChildren,
      ...(yHint !== undefined ? { x: 0, y: yHint } : {}),
    });
  }

  for (const [nodeId, nodeMeta] of graph.nodes) {
    const nodeParent = graph.parentOf.get(nodeId) ?? null;
    if (nodeParent !== parentId) continue;

    const tierIdx = getTierIndex(nodeMeta.tfType, settings);
    // Default unmatched nodes to the middle of the tier stack.
    const yHint = (tierIdx ?? Math.floor(tierCount / 2)) * tierSpacing;

    children.push({
      id: nodeId,
      width: RESOURCE_NODE_WIDTH,
      height: RESOURCE_NODE_HEIGHT,
      // y hint tells INTERACTIVE strategy which layer this node belongs in.
      x: 0,
      y: yHint,
    });
  }

  return children;
}

export function exportToELK(graph: CompoundGraph, settings: GraphSettings): ElkNode {
  const builtGroups = new Set<string>();
  const rootChildren = buildElkChildren(null, graph, builtGroups, settings);

  const edges: ElkExtendedEdge[] = graph.edges.map(([src, tgt], i) => ({
    id: `e${i}-${src}-${tgt}`,
    sources: [src],
    targets: [tgt],
  }));

  return {
    id: 'root',
    layoutOptions: ELK_ROOT_OPTIONS,
    children: rootChildren,
    edges,
  };
}
