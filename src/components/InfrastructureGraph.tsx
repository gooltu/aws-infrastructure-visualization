import { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import GroupNode from './nodes/GroupNode';
import ResourceNode from './nodes/ResourceNode';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { initialNodes, initialEdges } from '../data/threeTierArchitecture';
import type { GroupNodeData, ResourceNodeData } from '../types/aws';

const nodeTypes: NodeTypes = {
  awsGroup: GroupNode,
  awsResource: ResourceNode,
};

type AWSNode = Node<GroupNodeData | ResourceNodeData>;

function buildBreadcrumb(nodeId: string, nodes: AWSNode[]): string {
  const parts: string[] = [];
  let current: AWSNode | undefined = nodes.find(n => n.id === nodeId);
  while (current) {
    parts.unshift((current.data as GroupNodeData | ResourceNodeData).shortLabel.replace('\n', ' '));
    current = current.parentId ? nodes.find(n => n.id === current!.parentId) : undefined;
  }
  return parts.join(' / ');
}

export default function InfrastructureGraph() {
  const [nodes, , onNodesChange] = useNodesState<AWSNode>(initialNodes as AWSNode[]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const displayNodes = useMemo<AWSNode[]>(() => {
    return nodes.map(node => ({
      ...node,
      data: { ...node.data, isSelected: node.id === selectedNodeId },
    }));
  }, [nodes, selectedNodeId]);

  const displayEdges = useMemo<Edge[]>(() => {
    const hasSelection = selectedNodeId !== null;
    return edges.map(edge => {
      const connected = edge.source === selectedNodeId || edge.target === selectedNodeId;
      if (!hasSelection) {
        return { ...edge, style: { stroke: '#4a5568', strokeWidth: 1.5 }, animated: false };
      }
      return {
        ...edge,
        style: connected
          ? { stroke: '#4dabf7', strokeWidth: 2.5 }
          : { stroke: '#2d3748', strokeWidth: 1, opacity: 0.35 },
        animated: connected,
        zIndex: connected ? 1000 : 0,
      };
    });
  }, [edges, selectedNodeId]);

  const breadcrumb = useMemo(() => {
    if (!selectedNodeId) return null;
    return buildBreadcrumb(selectedNodeId, nodes as AWSNode[]);
  }, [selectedNodeId, nodes]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(prev => (prev === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const totalNodes = nodes.filter(n => n.type === 'awsResource').length;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel />
        <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.1}
          maxZoom={2.5}
          defaultEdgeOptions={{ type: 'smoothstep' }}
          proOptions={{ hideAttribution: true }}
          style={{ background: '#0a0a0f' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.2}
            color="#1e2030"
          />
          <Controls
            position="top-right"
            showInteractive={false}
          />
        </ReactFlow>
        </div>
        <RightPanel />
      </div>

      <StatusBar breadcrumb={breadcrumb} totalNodes={totalNodes} />
    </div>
  );
}


function StatusBar({ breadcrumb, totalNodes }: { breadcrumb: string | null; totalNodes: number }) {
  return (
    <div
      style={{
        height: 30,
        background: '#0d0d1a',
        borderTop: '1px solid #1e1e2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: breadcrumb ? '#4dabf7' : '#374151',
          fontWeight: 500,
          letterSpacing: '0.3px',
          transition: 'color 0.2s',
          fontFamily: 'monospace',
        }}
      >
        {breadcrumb ?? ''}
      </span>
      <span style={{ fontSize: 11, color: '#4b5563', fontWeight: 400 }}>
        Total nodes: {totalNodes}
      </span>
    </div>
  );
}
