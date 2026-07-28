import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import GroupNode from './nodes/GroupNode';
import ResourceNode from './nodes/ResourceNode';
import ResourcesModal from './ResourcesModal';
import SettingsPanel from './SettingsPanel';
import { runPipeline } from '../pipeline';
import { useSettings } from '../settings/SettingsContext';
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
  const { settings } = useSettings();
  const [nodes, setNodes, onNodesChange] = useNodesState<AWSNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache the fetched plan so re-layouts don't re-fetch.
  const planRef = useRef<unknown>(null);

  // Re-run layout when tiers or subnet ordering changes (showEdges is display-only).
  const layoutKey = useMemo(
    () => JSON.stringify({ tiers: settings.tiers, publicSubnetsFirst: settings.publicSubnetsFirst }),
    [settings.tiers, settings.publicSubnetsFirst],
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!planRef.current) {
          const response = await fetch('/tfplan.json');
          if (!response.ok) throw new Error(`Failed to fetch tfplan.json: ${response.status}`);
          planRef.current = await response.json();
        }
        const data = await runPipeline(planRef.current as Parameters<typeof runPipeline>[0], settings);
        setNodes(data.nodes as AWSNode[]);
        setEdges(data.edges);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  const displayNodes = useMemo<AWSNode[]>(() => {
    return nodes.map(node => ({
      ...node,
      data: { ...node.data, isSelected: node.id === selectedNodeId },
    }));
  }, [nodes, selectedNodeId]);

  const displayEdges = useMemo<Edge[]>(() => {
    if (!settings.showEdges) return [];
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
  }, [edges, selectedNodeId, settings.showEdges]);

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
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 10, color: '#4b5563', fontSize: 13,
            fontFamily: 'monospace', letterSpacing: '0.3px',
          }}>
            Parsing infrastructure plan…
          </div>
        )}
        {error && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 10, color: '#ef4444', fontSize: 13,
            fontFamily: 'monospace',
          }}>
            {error}
          </div>
        )}
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
          <Panel position="top-left">
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowResourcesModal(true)}
                style={panelBtnStyle}
              >
                View all resources
              </button>
              <button
                onClick={() => setShowSettings(s => !s)}
                style={{
                  ...panelBtnStyle,
                  ...(showSettings ? { borderColor: '#4dabf7', color: '#4dabf7' } : {}),
                }}
              >
                ⚙ Settings
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {showResourcesModal && (
        <ResourcesModal onClose={() => setShowResourcesModal(false)} />
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      <StatusBar breadcrumb={breadcrumb} totalNodes={totalNodes} />
    </div>
  );
}

const panelBtnStyle: React.CSSProperties = {
  background: '#0d1117',
  border: '1px solid #2d3748',
  borderRadius: 6,
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 500,
  padding: '6px 12px',
  letterSpacing: '0.2px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
};

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
