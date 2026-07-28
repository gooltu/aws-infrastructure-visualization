import { useState } from 'react';
import { useSettings } from '../settings/SettingsContext';
import type { Tier } from '../settings/types';

interface Props {
  onClose: () => void;
}

const TIER_COLORS: Record<string, string> = {
  internet: '#22d3ee',
  compute: '#f97316',
  data: '#a78bfa',
};

function tierColor(id: string) {
  return TIER_COLORS[id] ?? '#4b5563';
}

export default function SettingsPanel({ onClose }: Props) {
  const { settings, setShowEdges, setPublicSubnetsFirst, moveTierUp, moveTierDown, updateTierTypes } = useSettings();
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  function startEdit(tier: Tier) {
    setEditingTier(tier.id);
    setEditValue(tier.resourceTypes.join(', '));
  }

  function commitEdit(id: string) {
    const types = editValue
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    updateTierTypes(id, types);
    setEditingTier(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          zIndex: 900,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 320,
          background: '#0d1117',
          borderLeft: '1px solid #1e2030',
          zIndex: 901,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid #1e2030',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.2px' }}>
            Graph Settings
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#6b7280',
              cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

          {/* ── Display section ── */}
          <Section label="Display">
            <Row label="Show edges">
              <Toggle value={settings.showEdges} onChange={setShowEdges} />
            </Row>
            <Row label="Public subnets first">
              <Toggle value={settings.publicSubnetsFirst} onChange={setPublicSubnetsFirst} />
            </Row>
          </Section>

          <Divider />

          {/* ── Node ordering section ── */}
          <Section label="Node Layer Order" hint="Top → Bottom">
            <p style={{ fontSize: 11, color: '#4b5563', margin: '0 0 12px', lineHeight: 1.5 }}>
              Resources are grouped into tiers. Drag the tiers to set their vertical order in the diagram.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {settings.tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  style={{
                    background: '#0b0f1a',
                    border: '1px solid #1a2235',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  {/* Tier header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: tierColor(tier.id),
                    }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                      {tier.label}
                    </span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      <ArrowBtn
                        dir="up"
                        disabled={idx === 0}
                        onClick={() => moveTierUp(tier.id)}
                      />
                      <ArrowBtn
                        dir="down"
                        disabled={idx === settings.tiers.length - 1}
                        onClick={() => moveTierDown(tier.id)}
                      />
                    </div>
                  </div>

                  {/* Resource types */}
                  <div style={{ padding: '0 10px 10px' }}>
                    {editingTier === tier.id ? (
                      <div>
                        <textarea
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{
                            width: '100%', boxSizing: 'border-box',
                            background: '#131825', border: '1px solid #2a3448',
                            borderRadius: 4, color: '#cbd5e1', fontSize: 10,
                            fontFamily: 'monospace', padding: '6px 8px',
                            resize: 'vertical', minHeight: 60,
                            outline: 'none',
                          }}
                          placeholder="comma-separated resource types"
                        />
                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                          <button
                            onClick={() => commitEdit(tier.id)}
                            style={btnStyle('#1e3a5f', '#60a5fa')}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTier(null)}
                            style={btnStyle('#1a1a2e', '#4b5563')}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {tier.resourceTypes.map(type => (
                            <span key={type} style={{
                              fontSize: 9, color: '#4b5563', background: '#131825',
                              border: '1px solid #1e2030', borderRadius: 3,
                              padding: '2px 5px', fontFamily: 'monospace',
                            }}>
                              {type.replace('aws_', '')}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => startEdit(tier)}
                          style={{ ...btnStyle('#131825', '#374151'), marginTop: 8, fontSize: 10 }}
                        >
                          Edit types
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 10, color: '#374151', marginTop: 10, lineHeight: 1.5 }}>
              Resources not matched to any tier are placed based on their dependencies.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {label}
        </span>
        {hint && (
          <span style={{ fontSize: 10, color: '#374151' }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#1e2030', margin: '16px 0' }} />;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: value ? '#2563eb' : '#1e2030',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

function ArrowBtn({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none', border: 'none',
        color: disabled ? '#2d3748' : '#4b5563',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 12, padding: '2px 4px', borderRadius: 3,
        lineHeight: 1,
      }}
    >
      {dir === 'up' ? '▲' : '▼'}
    </button>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    background: bg, border: `1px solid ${color}`,
    color, borderRadius: 4, cursor: 'pointer',
    fontSize: 11, padding: '4px 10px',
  };
}
