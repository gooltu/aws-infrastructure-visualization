import type { Node, Edge } from '@xyflow/react';
import type { GroupNodeData, ResourceNodeData, AWSEdgeData } from '../types/aws';

export const initialNodes: Node<GroupNodeData | ResourceNodeData>[] = [
  // ── REGION ──────────────────────────────────────────────
  {
    id: 'region-us-east-1',
    type: 'awsGroup',
    position: { x: 30, y: 20 },
    data: { label: 'US East (N. Virginia)', shortLabel: 'us-east-1', subtype: 'region' },
    style: { width: 800, height: 720 },
    selectable: true,
    draggable: false,
  },

  // ── VPC ─────────────────────────────────────────────────
  {
    id: 'vpc-main',
    type: 'awsGroup',
    position: { x: 20, y: 60 },
    parentId: 'region-us-east-1',
    extent: 'parent',
    data: { label: 'myapp-vpc  10.0.0.0/16', shortLabel: 'myapp-vpc', subtype: 'vpc' },
    style: { width: 760, height: 640 },
    selectable: true,
    draggable: false,
  },

  // ── Internet Gateway (inside VPC, top center) ────────────
  {
    id: 'igw-main',
    type: 'awsResource',
    position: { x: 348, y: 22 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'myapp-igw', shortLabel: 'myapp-igw', subtype: 'igw' },
    selectable: true,
    draggable: true,
  },

  // ── AZ us-east-1a ────────────────────────────────────────
  {
    id: 'az-1a',
    type: 'awsGroup',
    position: { x: 20, y: 115 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'us-east-1a', shortLabel: 'us-east-1a', subtype: 'az' },
    style: { width: 340, height: 500 },
    selectable: true,
    draggable: false,
  },

  // ── AZ us-east-1b ────────────────────────────────────────
  {
    id: 'az-1b',
    type: 'awsGroup',
    position: { x: 400, y: 115 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'us-east-1b', shortLabel: 'us-east-1b', subtype: 'az' },
    style: { width: 340, height: 290 },
    selectable: true,
    draggable: false,
  },

  // ── Public subnet in AZ 1a ───────────────────────────────
  {
    id: 'subnet-public-1a',
    type: 'awsGroup',
    position: { x: 22, y: 50 },
    parentId: 'az-1a',
    extent: 'parent',
    data: { label: 'myapp-public-1a  10.0.1.0/24', shortLabel: 'public-1a', subtype: 'subnet' },
    style: { width: 296, height: 155 },
    selectable: true,
    draggable: false,
  },

  // ── Private subnet in AZ 1a ─────────────────────────────
  {
    id: 'subnet-private-1a',
    type: 'awsGroup',
    position: { x: 22, y: 275 },
    parentId: 'az-1a',
    extent: 'parent',
    data: { label: 'myapp-private-1a  10.0.2.0/24', shortLabel: 'private-1a', subtype: 'subnet' },
    style: { width: 296, height: 155 },
    selectable: true,
    draggable: false,
  },

  // ── Private subnet in AZ 1b ─────────────────────────────
  {
    id: 'subnet-private-1b',
    type: 'awsGroup',
    position: { x: 22, y: 50 },
    parentId: 'az-1b',
    extent: 'parent',
    data: { label: 'myapp-private-1b  10.0.3.0/24', shortLabel: 'private-1b', subtype: 'subnet' },
    style: { width: 296, height: 155 },
    selectable: true,
    draggable: false,
  },

  // ── EC2 in public-1a ────────────────────────────────────
  {
    id: 'ec2-web',
    type: 'awsResource',
    position: { x: 109, y: 40 },
    parentId: 'subnet-public-1a',
    extent: 'parent',
    data: { label: 'myapp-ec2  t3.micro', shortLabel: 'myapp-ec2\nt3.micro', subtype: 'ec2' },
    selectable: true,
    draggable: true,
  },

  // ── RDS in private-1a ───────────────────────────────────
  {
    id: 'rds-main',
    type: 'awsResource',
    position: { x: 109, y: 34 },
    parentId: 'subnet-private-1a',
    extent: 'parent',
    data: { label: 'myapp-rds  MariaDB 10.11', shortLabel: 'myapp-rds\nMariaDB', subtype: 'rds' },
    selectable: true,
    draggable: true,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  style: { stroke: '#4a5568', strokeWidth: 1.5 },
  animated: false,
};

export const initialEdges: Edge<AWSEdgeData>[] = [
  // Internet → IGW (implied external traffic)
  { ...edgeBase, id: 'e-igw-ec2', source: 'igw-main', target: 'ec2-web', data: { trafficType: 'http' } },
  // EC2 → RDS (MariaDB TCP 3306)
  { ...edgeBase, id: 'e-ec2-rds', source: 'ec2-web', target: 'rds-main', data: { trafficType: 'database' } },
];
