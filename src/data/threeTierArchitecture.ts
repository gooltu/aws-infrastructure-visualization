import type { Node, Edge } from '@xyflow/react';
import type { GroupNodeData, ResourceNodeData, AWSEdgeData } from '../types/aws';

export const initialNodes: Node<GroupNodeData | ResourceNodeData>[] = [
  // ── REGION ──────────────────────────────────────────────
  {
    id: 'region-us-east-1',
    type: 'awsGroup',
    position: { x: 30, y: 20 },
    data: { label: 'US East (N.Virginia)', shortLabel: 'us-east', subtype: 'region' },
    style: { width: 830, height: 970 },
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
    data: { label: 'main vpc', shortLabel: 'main VPC', subtype: 'vpc' },
    style: { width: 690, height: 890 },
    selectable: true,
    draggable: false,
  },

  // ── App ELB (inside VPC, above AZs) ─────────────────────
  {
    id: 'alb-app',
    type: 'awsResource',
    position: { x: 315, y: 22 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'App ELB', shortLabel: 'App ELB', subtype: 'alb' },
    selectable: true,
    draggable: true,
  },

  // ── AZ 1a ───────────────────────────────────────────────
  {
    id: 'az-1a',
    type: 'awsGroup',
    position: { x: 20, y: 105 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'us-east-1a', shortLabel: 'us-east-1a', subtype: 'az' },
    style: { width: 300, height: 750 },
    selectable: true,
    draggable: false,
  },

  // ── AZ 1b ───────────────────────────────────────────────
  {
    id: 'az-1b',
    type: 'awsGroup',
    position: { x: 370, y: 105 },
    parentId: 'vpc-main',
    extent: 'parent',
    data: { label: 'us-east-1b', shortLabel: 'us-east-1b', subtype: 'az' },
    style: { width: 300, height: 750 },
    selectable: true,
    draggable: false,
  },

  // ── Subnets in AZ 1a ────────────────────────────────────
  {
    id: 'subnet-web-1',
    type: 'awsGroup',
    position: { x: 22, y: 55 },
    parentId: 'az-1a',
    extent: 'parent',
    data: { label: 'web-subnet-1', shortLabel: 'web-subnet-1', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },
  {
    id: 'subnet-app-1',
    type: 'awsGroup',
    position: { x: 22, y: 275 },
    parentId: 'az-1a',
    extent: 'parent',
    data: { label: 'app-subnet-1', shortLabel: 'app-subnet-1', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },
  {
    id: 'subnet-db-1',
    type: 'awsGroup',
    position: { x: 22, y: 495 },
    parentId: 'az-1a',
    extent: 'parent',
    data: { label: 'db-subnet-1', shortLabel: 'db-subnet-1', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },

  // ── Subnets in AZ 1b ────────────────────────────────────
  {
    id: 'subnet-web-2',
    type: 'awsGroup',
    position: { x: 22, y: 55 },
    parentId: 'az-1b',
    extent: 'parent',
    data: { label: 'web-subnet-2', shortLabel: 'web-subnet-2', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },
  {
    id: 'subnet-app-2',
    type: 'awsGroup',
    position: { x: 22, y: 275 },
    parentId: 'az-1b',
    extent: 'parent',
    data: { label: 'app-subnet-2', shortLabel: 'app-subnet-2', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },
  {
    id: 'subnet-db-2',
    type: 'awsGroup',
    position: { x: 22, y: 495 },
    parentId: 'az-1b',
    extent: 'parent',
    data: { label: 'db-subnet-2', shortLabel: 'db-subnet-2', subtype: 'subnet' },
    style: { width: 256, height: 145 },
    selectable: true,
    draggable: false,
  },

  // ── Resource nodes ───────────────────────────────────────
  {
    id: 'web-server-1',
    type: 'awsResource',
    position: { x: 98, y: 38 },
    parentId: 'subnet-web-1',
    extent: 'parent',
    data: { label: 'web servers', shortLabel: 'web servers', subtype: 'ec2' },
    selectable: true,
    draggable: true,
  },
  {
    id: 'ec2-app-1',
    type: 'awsResource',
    position: { x: 98, y: 38 },
    parentId: 'subnet-app-1',
    extent: 'parent',
    data: { label: 'ec2 servers', shortLabel: 'ec2 servers', subtype: 'ec2' },
    selectable: true,
    draggable: true,
  },
  {
    id: 'db-rw-1',
    type: 'awsResource',
    position: { x: 98, y: 32 },
    parentId: 'subnet-db-1',
    extent: 'parent',
    data: { label: 'Read-write replica', shortLabel: 'Read-write\nreplica', subtype: 'rds' },
    selectable: true,
    draggable: true,
  },
  {
    id: 'web-server-2',
    type: 'awsResource',
    position: { x: 98, y: 38 },
    parentId: 'subnet-web-2',
    extent: 'parent',
    data: { label: 'web servers', shortLabel: 'web servers', subtype: 'ec2' },
    selectable: true,
    draggable: true,
  },
  {
    id: 'ec2-app-2',
    type: 'awsResource',
    position: { x: 98, y: 38 },
    parentId: 'subnet-app-2',
    extent: 'parent',
    data: { label: 'ec2 servers', shortLabel: 'ec2 servers', subtype: 'ec2' },
    selectable: true,
    draggable: true,
  },
  {
    id: 'db-ro-2',
    type: 'awsResource',
    position: { x: 98, y: 32 },
    parentId: 'subnet-db-2',
    extent: 'parent',
    data: { label: 'Read-only replica', shortLabel: 'Read-only\nreplica', subtype: 'rds' },
    selectable: true,
    draggable: true,
  },

  // ── S3 (outside VPC) ─────────────────────────────────────
  {
    id: 's3-bucket',
    type: 'awsResource',
    position: { x: 910, y: 160 },
    data: { label: 'S3 bucket', shortLabel: 'S3 bucket', subtype: 's3' },
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
  // ALB → web servers (fan out)
  { ...edgeBase, id: 'e-alb-web1', source: 'alb-app', target: 'web-server-1', data: { trafficType: 'http' } },
  { ...edgeBase, id: 'e-alb-web2', source: 'alb-app', target: 'web-server-2', data: { trafficType: 'http' } },
  // ALB → app servers (direct, bypass web tier for internal services)
  { ...edgeBase, id: 'e-alb-app1', source: 'alb-app', target: 'ec2-app-1', data: { trafficType: 'http' } },
  { ...edgeBase, id: 'e-alb-app2', source: 'alb-app', target: 'ec2-app-2', data: { trafficType: 'http' } },
  // App servers → databases
  { ...edgeBase, id: 'e-app1-db1', source: 'ec2-app-1', target: 'db-rw-1', data: { trafficType: 'database' } },
  { ...edgeBase, id: 'e-app2-db2', source: 'ec2-app-2', target: 'db-ro-2', data: { trafficType: 'database' } },
];
