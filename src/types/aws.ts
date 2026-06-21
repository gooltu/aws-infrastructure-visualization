export type ResourceSubtype = 'ec2' | 'rds' | 'alb' | 's3' | 'lambda' | 'cloudfront' | 'igw';
export type GroupSubtype = 'region' | 'vpc' | 'az' | 'subnet';

export interface GroupNodeData {
  label: string;
  shortLabel: string;
  subtype: GroupSubtype;
  isSelected?: boolean;
  [key: string]: unknown;
}

export interface ResourceNodeData {
  label: string;
  shortLabel: string;
  subtype: ResourceSubtype;
  arn?: string;
  region?: string;
  vpcId?: string;
  az?: string;
  subnetId?: string;
  tags?: Record<string, string>;
  metrics?: { cpuUsage: number; networkIn: number; networkOut: number };
  isSelected?: boolean;
  [key: string]: unknown;
}

export interface AWSEdgeData {
  label?: string;
  trafficType?: 'http' | 'tcp' | 'database';
  volume?: string;
  [key: string]: unknown;
}
