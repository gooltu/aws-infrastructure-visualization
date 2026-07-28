import type { Node, Edge } from '@xyflow/react';
import type { GroupNodeData, ResourceNodeData } from '../types/aws';
import type { TfPlan } from './CompoundGraph';
import type { GraphSettings } from '../settings/types';
import { parseTfPlan } from './CompoundGraph';
import { exportToELK } from './elkTransformer';
import { runLayout } from './elkLayout';
import { convertToReactFlow } from './reactFlowConverter';

type AWSNode = Node<GroupNodeData | ResourceNodeData>;

export async function runPipeline(
  plan: TfPlan,
  settings: GraphSettings,
): Promise<{ nodes: AWSNode[]; edges: Edge[] }> {
  const graph = parseTfPlan(plan);
  console.log('1. CompoundGraph', {
    groups: Object.fromEntries([...graph.groups.entries()].map(([id, meta]) => [id, { ...meta, parent: graph.parentOf.get(id) ?? null }])),
    nodes: Object.fromEntries([...graph.nodes.entries()].map(([id, meta]) => [id, { ...meta, parent: graph.parentOf.get(id) ?? null }])),
    edges: graph.edges.map(([src, tgt]) => `${src} → ${tgt}`),
  });

  const elkGraph = exportToELK(graph, settings);
  console.log('2. ELK JSON', elkGraph);

  const layouted = await runLayout(elkGraph);
  console.log('3. ELK Layout Output', layouted);

  const reactFlow = convertToReactFlow(layouted, graph);
  console.log('4. React Flow Payload', reactFlow);

  return reactFlow;
}

export type { TfPlan };
