import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ResourceNodeData, ResourceSubtype } from '../../types/aws';

const subtypeConfig: Record<ResourceSubtype, {
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  ec2: {
    bg: '#c05621',
    border: '#ed8936',
    icon: <EC2Icon />,
  },
  rds: {
    bg: '#1a4a7a',
    border: '#3b82f6',
    icon: <RDSIcon />,
  },
  alb: {
    bg: '#5b21b6',
    border: '#8b5cf6',
    icon: <ALBIcon />,
  },
  s3: {
    bg: '#145a32',
    border: '#27ae60',
    icon: <S3Icon />,
  },
  lambda: {
    bg: '#7a3a1a',
    border: '#f97316',
    icon: <LambdaIcon />,
  },
  cloudfront: {
    bg: '#1a4a6a',
    border: '#06b6d4',
    icon: <CloudFrontIcon />,
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
        {cfg.icon}
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

// ── AWS Service Icons ────────────────────────────────────────────────────────

function EC2Icon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="5" y="5" width="24" height="24" rx="3" stroke="#ff9900" strokeWidth="1.5" fill="none" />
      <rect x="9" y="9" width="16" height="16" rx="2" fill="#ff9900" opacity="0.15" />
      <rect x="11" y="11" width="5" height="5" rx="1" fill="#ff9900" />
      <rect x="18" y="11" width="5" height="5" rx="1" fill="#ff9900" />
      <rect x="11" y="18" width="5" height="5" rx="1" fill="#ff9900" />
      <rect x="18" y="18" width="5" height="5" rx="1" fill="#ff9900" />
      <line x1="2" y1="13" x2="5" y2="13" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="17" x2="5" y2="17" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="21" x2="5" y2="21" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="13" x2="32" y2="13" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="17" x2="32" y2="17" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="21" x2="32" y2="21" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RDSIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <ellipse cx="17" cy="10" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.5" fill="#3b82f6" fillOpacity="0.2" />
      <path d="M8 10 L8 24" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M26 10 L26 24" stroke="#3b82f6" strokeWidth="1.5" />
      <ellipse cx="17" cy="24" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.5" fill="#3b82f6" fillOpacity="0.2" />
      <path d="M8 17 Q17 21 26 17" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2 1" />
      <ellipse cx="17" cy="10" rx="9" ry="4" fill="#3b82f6" fillOpacity="0.15" />
    </svg>
  );
}

function ALBIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="10" r="3.5" fill="#8b5cf6" />
      <circle cx="9" cy="24" r="3.5" fill="#8b5cf6" />
      <circle cx="25" cy="24" r="3.5" fill="#8b5cf6" />
      <line x1="17" y1="13.5" x2="9" y2="20.5" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1="17" y1="13.5" x2="25" y2="20.5" stroke="#8b5cf6" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2.5" fill="#8b5cf6" opacity="0.6" />
      <line x1="4" y1="17" x2="13" y2="17" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="2 1" />
      <line x1="21" y1="17" x2="30" y2="17" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="2 1" />
    </svg>
  );
}

function S3Icon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M9 13 L17 9 L25 13 L25 25 L17 29 L9 25 Z" stroke="#27ae60" strokeWidth="1.5" fill="#27ae60" fillOpacity="0.15" />
      <path d="M9 13 L17 17 L25 13" stroke="#27ae60" strokeWidth="1.5" />
      <path d="M17 17 L17 29" stroke="#27ae60" strokeWidth="1.5" />
      <ellipse cx="17" cy="13" rx="8" ry="3" fill="#27ae60" fillOpacity="0.3" />
    </svg>
  );
}

function LambdaIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M8 26 L14 12 L17 18" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 18 L22 26" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 8 L26 26" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloudFrontIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="10" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
      <ellipse cx="17" cy="17" rx="5" ry="10" stroke="#06b6d4" strokeWidth="1" fill="none" />
      <line x1="7" y1="17" x2="27" y2="17" stroke="#06b6d4" strokeWidth="1" />
    </svg>
  );
}

export default memo(ResourceNode);
