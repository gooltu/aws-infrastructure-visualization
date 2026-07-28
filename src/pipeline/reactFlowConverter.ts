import type { Node, Edge } from '@xyflow/react';
import type { ElkNode, ElkExtendedEdge } from 'elkjs';
import type { GroupNodeData, ResourceNodeData } from '../types/aws';
import type { CompoundGraph } from './CompoundGraph';

type AWSNode = Node<GroupNodeData | ResourceNodeData>;

function flattenNodes(
  elkNode: ElkNode,
  graph: CompoundGraph,
  parentId: string | undefined,
  result: AWSNode[],
) {
  for (const child of elkNode.children ?? []) {
    const x = child.x ?? 0;
    const y = child.y ?? 0;
    const w = child.width ?? 0;
    const h = child.height ?? 0;

    const groupMeta = graph.groups.get(child.id);
    const nodeMeta = graph.nodes.get(child.id);

    if (groupMeta) {
      const node: AWSNode = {
        id: child.id,
        type: 'awsGroup',
        position: { x, y },
        data: {
          label: groupMeta.label,
          shortLabel: groupMeta.shortLabel,
          subtype: groupMeta.subtype,
        } as GroupNodeData,
        style: { width: w, height: h },
        selectable: true,
        draggable: false,
        ...(parentId ? { parentId, extent: 'parent' as const } : {}),
      };
      result.push(node);
      flattenNodes(child, graph, child.id, result);
    } else if (nodeMeta) {
      const node: AWSNode = {
        id: child.id,
        type: 'awsResource',
        position: { x, y },
        data: {
          label: nodeMeta.label,
          shortLabel: nodeMeta.shortLabel,
          subtype: nodeMeta.subtype,
        } as ResourceNodeData,
        selectable: true,
        draggable: true,
        ...(parentId ? { parentId, extent: 'parent' as const } : {}),
      };
      result.push(node);
    }
  }
}

function flattenEdges(elkNode: ElkNode, result: Edge[]): void {
  for (const edge of (elkNode.edges ?? []) as ElkExtendedEdge[]) {
    result.push({
      id: edge.id,
      source: edge.sources[0],
      target: edge.targets[0],
      type: 'smoothstep',
      style: { stroke: '#4a5568', strokeWidth: 1.5 },
      animated: false,
    });
  }
  for (const child of elkNode.children ?? []) {
    flattenEdges(child, result);
  }
}

export function convertToReactFlow(
  layoutedGraph: ElkNode,
  graph: CompoundGraph,
): { nodes: AWSNode[]; edges: Edge[] } {
  const nodes: AWSNode[] = [];
  const edges: Edge[] = [];

  flattenNodes(layoutedGraph, graph, undefined, nodes);
  flattenEdges(layoutedGraph, edges);

  return { nodes, edges };
}
