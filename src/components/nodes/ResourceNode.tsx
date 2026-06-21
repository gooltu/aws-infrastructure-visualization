import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ResourceNodeData, ResourceSubtype } from '../../types/aws';

import ec2Icon from './Icon-Resource/Res_Amazon-EC2_Instance_48.png';
import rdsIcon from './Icon-Resource/Res_Amazon-Aurora_Amazon-RDS-Instance_48.png';
import albIcon from './Icon-Resource/Res_Elastic-Load-Balancing_Application-Load-Balancer_48.png';
import s3Icon from './Icon-Resource/Res_Amazon-Simple-Storage-Service_Bucket_48.png';
import lambdaIcon from './Icon-Resource/Res_AWS-Lambda_Lambda-Function_48.png';
import cloudfrontIcon from './Icon-Resource/Res_Amazon-CloudFront_Download-Distribution_48.png';
import igwIcon from './Icon-Resource/Res_Amazon-VPC_Internet-Gateway_48.png';

const subtypeConfig: Record<ResourceSubtype, {
  bg: string;
  border: string;
  iconSrc: string;
}> = {
  ec2: {
    bg: '#c05621',
    border: '#ed8936',
    iconSrc: ec2Icon,
  },
  rds: {
    bg: '#1a4a7a',
    border: '#3b82f6',
    iconSrc: rdsIcon,
  },
  alb: {
    bg: '#5b21b6',
    border: '#8b5cf6',
    iconSrc: albIcon,
  },
  s3: {
    bg: '#145a32',
    border: '#27ae60',
    iconSrc: s3Icon,
  },
  lambda: {
    bg: '#7a3a1a',
    border: '#f97316',
    iconSrc: lambdaIcon,
  },
  cloudfront: {
    bg: '#1a4a6a',
    border: '#06b6d4',
    iconSrc: cloudfrontIcon,
  },
  igw: {
    bg: '#1a3a2a',
    border: '#22c55e',
    iconSrc: igwIcon,
  },
};

function ResourceNode({ data }: NodeProps<ResourceNodeData>) {
  const cfg = subtypeConfig[data.subtype];
  const isSelected = data.isSelected === true;
  const lines = data.shortLabel.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#4a5568', border: '1px solid #2d3748', width: 6, height: 6 }}
      />

      {/* Icon box */}
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 10,
          background: cfg.bg,
          border: `2px solid ${isSelected ? '#4dabf7' : cfg.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSelected
            ? `0 0 0 3px rgba(77, 171, 247, 0.3), 0 4px 12px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.35)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <img
          src={cfg.iconSrc}
          width={36}
          height={36}
          alt={data.subtype}
          style={{ display: 'block' }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: isSelected ? '#93c5fd' : '#cbd5e1',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
              letterSpacing: '0.2px',
              transition: 'color 0.2s',
            }}
          >
            {line}
          </span>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#4a5568', border: '1px solid #2d3748', width: 6, height: 6 }}
      />
    </div>
  );
}

export default memo(ResourceNode);
