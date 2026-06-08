import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { GroupNodeData, GroupSubtype } from '../../types/aws';

const subtypeConfig: Record<GroupSubtype, {
  borderColor: string;
  bgColor: string;
  labelColor: string;
  iconBg: string;
  iconContent: string;
}> = {
  region: {
    borderColor: '#3a3a5a',
    bgColor: 'rgba(10, 10, 20, 0.6)',
    labelColor: '#94a3b8',
    iconBg: '#ff9900',
    iconContent: 'aws',
  },
  vpc: {
    borderColor: '#5a3a8a',
    bgColor: 'rgba(30, 15, 50, 0.4)',
    labelColor: '#b48fec',
    iconBg: '#7c3aed',
    iconContent: 'vpc',
  },
  az: {
    borderColor: '#2a5a8a',
    bgColor: 'rgba(10, 25, 50, 0.4)',
    labelColor: '#7ab5e8',
    iconBg: '#2563eb',
    iconContent: 'az',
  },
  subnet: {
    borderColor: '#1e4060',
    bgColor: 'rgba(8, 20, 40, 0.5)',
    labelColor: '#60a5fa',
    iconBg: '#1e40af',
    iconContent: 'sn',
  },
};

function GroupNode({ data, selected }: NodeProps<GroupNodeData>) {
  const cfg = subtypeConfig[data.subtype];
  const isRegion = data.subtype === 'region';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: isRegion ? 10 : 8,
        border: `1.5px solid ${selected ? '#4dabf7' : cfg.borderColor}`,
        background: cfg.bgColor,
        backdropFilter: 'blur(2px)',
        position: 'relative',
        boxShadow: selected ? `0 0 0 1px #4dabf7, inset 0 0 20px rgba(77, 171, 247, 0.05)` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Header label */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          pointerEvents: 'none',
        }}
      >
        {/* Icon badge */}
        {isRegion ? (
          <div
            style={{
              background: '#ff9900',
              borderRadius: 4,
              padding: '2px 5px',
              fontSize: 9,
              fontWeight: 700,
              color: '#000',
              letterSpacing: '0.5px',
              lineHeight: 1.4,
            }}
          >
            aws
          </div>
        ) : (
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: cfg.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SubtypeIcon subtype={data.subtype} />
          </div>
        )}
        <span
          style={{
            fontSize: isRegion ? 13 : 11,
            fontWeight: isRegion ? 600 : 500,
            color: cfg.labelColor,
            whiteSpace: 'nowrap',
            letterSpacing: '0.2px',
          }}
        >
          {data.label}
        </span>
      </div>
    </div>
  );
}

function SubtypeIcon({ subtype }: { subtype: GroupSubtype }) {
  switch (subtype) {
    case 'vpc':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.2" />
          <line x1="5" y1="1" x2="5" y2="9" stroke="white" strokeWidth="1" />
          <line x1="1" y1="5" x2="9" y2="5" stroke="white" strokeWidth="1" />
        </svg>
      );
    case 'az':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1L9 8H1L5 1Z" stroke="white" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case 'subnet':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="white" strokeWidth="1.2" />
          <rect x="3.5" y="3.5" width="3" height="3" fill="white" />
        </svg>
      );
    default:
      return null;
  }
}

export default memo(GroupNode);
