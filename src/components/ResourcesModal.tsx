import { useEffect } from 'react';
import { subtypeConfig } from './nodes/ResourceNode';
import type { ResourceSubtype } from '../types/aws';

type Entry = [ResourceSubtype, typeof subtypeConfig[ResourceSubtype]];

// Build ordered category groups
const grouped = new Map<string, Entry[]>();
for (const entry of Object.entries(subtypeConfig) as Entry[]) {
  const cat = entry[1].category;
  if (!grouped.has(cat)) grouped.set(cat, []);
  grouped.get(cat)!.push(entry);
}
const categories = [...grouped.keys()].sort();
const total = Object.keys(subtypeConfig).length;

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ');
}

interface Props {
  onClose: () => void;
}

export default function ResourcesModal({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1117',
          border: '1px solid #1e2030',
          borderRadius: 12,
          width: 760,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #1e2030',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
            All Resources
            <span style={{ marginLeft: 8, fontSize: 11, color: '#4b5563', fontWeight: 400 }}>
              {total} resources · {categories.length} categories
            </span>
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: 16,
              padding: '4px 6px',
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {categories.map(cat => {
            const entries = grouped.get(cat)!;
            return (
              <section key={cat}>
                {/* Category header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: '#1e2030' }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#4b5563',
                      letterSpacing: '0.9px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCategory(cat)}
                    <span style={{ marginLeft: 6, fontWeight: 400, color: '#374151' }}>
                      ({entries.length})
                    </span>
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#1e2030' }} />
                </div>

                {/* 3-per-row grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                  }}
                >
                  {entries.map(([key, cfg]) => (
                    <div
                      key={key}
                      style={{
                        background: '#0b0f1a',
                        border: '1px solid #1a2235',
                        borderRadius: 10,
                        padding: '14px 10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        minWidth: 0,
                      }}
                    >
                      {/* Icon box — identical styling to the canvas ResourceNode */}
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 10,
                          background: '#131825',
                          border: '2px solid #2a3448',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={cfg.iconSrc}
                          width={36}
                          height={36}
                          alt={key}
                          style={{ display: 'block' }}
                        />
                      </div>

                      {/* Terraform resource name */}
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 500,
                          color: '#cbd5e1',
                          textAlign: 'center',
                          lineHeight: 1.4,
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          width: '100%',
                        }}
                      >
                        {key}
                      </span>

                      {/* AWS service name */}
                      <span
                        style={{
                          fontSize: 9,
                          color: '#374151',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                        }}
                      >
                        {cfg.awsServiceName}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
