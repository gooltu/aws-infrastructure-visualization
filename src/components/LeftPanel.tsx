import { useState } from 'react';

// ─── Types & Data ─────────────────────────────────────────────────────────────

type VarType = 'string' | 'number' | 'bool' | 'list';

interface TfVariable {
  name: string;
  type: VarType;
  defaultValue: string | null;
  sensitive?: boolean;
}

const VARIABLES: TfVariable[] = [
  { name: 'aws_region',                 type: 'string', defaultValue: 'us-east-1' },
  { name: 'environment',                type: 'string', defaultValue: 'production' },
  { name: 'project',                    type: 'string', defaultValue: 'three-tier-app' },
  { name: 'vpc_cidr',                   type: 'string', defaultValue: '10.0.0.0/16' },
  { name: 'web_subnet_cidrs',           type: 'list',   defaultValue: '["10.0.1.0/24", ...]' },
  { name: 'app_subnet_cidrs',           type: 'list',   defaultValue: '["10.0.11.0/24", ...]' },
  { name: 'db_subnet_cidrs',            type: 'list',   defaultValue: '["10.0.21.0/24", ...]' },
  { name: 'availability_zones',         type: 'list',   defaultValue: '["us-east-1a", "us-east-1b"]' },
  { name: 'web_instance_type',          type: 'string', defaultValue: 't3.small' },
  { name: 'app_instance_type',          type: 'string', defaultValue: 't3.medium' },
  { name: 'web_asg_min',               type: 'number', defaultValue: '2' },
  { name: 'web_asg_max',               type: 'number', defaultValue: '6' },
  { name: 'app_asg_min',               type: 'number', defaultValue: '2' },
  { name: 'app_asg_max',               type: 'number', defaultValue: '6' },
  { name: 'db_instance_class',          type: 'string', defaultValue: 'db.r6g.large' },
  { name: 'db_name',                    type: 'string', defaultValue: 'appdb' },
  { name: 'db_master_username',         type: 'string', defaultValue: 'admin' },
  { name: 'db_master_password',         type: 'string', defaultValue: null, sensitive: true },
  { name: 'enable_deletion_protection', type: 'bool',   defaultValue: 'true' },
];

const TYPE_COLORS: Record<VarType, { bg: string; text: string }> = {
  string: { bg: 'rgba(59,130,246,0.18)',  text: '#60a5fa' },
  number: { bg: 'rgba(217,119,6,0.18)',   text: '#fbbf24' },
  bool:   { bg: 'rgba(34,197,94,0.18)',   text: '#4ade80' },
  list:   { bg: 'rgba(167,139,250,0.18)', text: '#a78bfa' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 11 11" fill="none"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease', flexShrink: 0 }}
    >
      <path d="M3.5 2 L7.5 5.5 L3.5 9" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypeBadge({ type }: { type: VarType }) {
  const c = TYPE_COLORS[type];
  return (
    <span style={{
      fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
      padding: '1px 5px', borderRadius: 3,
      background: c.bg, color: c.text,
      letterSpacing: '0.2px', flexShrink: 0,
      lineHeight: '14px',
    }}>
      {type}
    </span>
  );
}

function Section({
  title, count, open, onToggle, children,
}: {
  title: string; count?: number; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: '1px solid #141424' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 12px', background: 'none', border: 'none',
          cursor: 'pointer', color: '#9ca3af', userSelect: 'none',
        }}
      >
        <Chevron open={open} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', flex: 1, textAlign: 'left' }}>
          {title}
        </span>
        {count !== undefined && (
          <span style={{ fontSize: 10, color: '#4b5563', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0 6px', lineHeight: '16px' }}>
            {count}
          </span>
        )}
      </button>
      <div style={{ maxHeight: open ? '9999px' : '0px', overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeftPanel() {
  const [open, setOpen] = useState({ variables: true, locals: false, outputs: false, providers: false, modules: false });
  const toggle = (k: keyof typeof open) => setOpen(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{
      width: 260, flexShrink: 0, height: '100%',
      background: '#0d0d1a', borderRight: '1px solid #1e1e2e',
      display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '9px 14px 8px', borderBottom: '1px solid #1e1e2e', flexShrink: 0,
        fontSize: 11, fontWeight: 600, color: '#4b5563', letterSpacing: '0.6px', textTransform: 'uppercase',
      }}>
        Terraform Config
      </div>

      {/* Variables */}
      <Section title="Variables" count={VARIABLES.length} open={open.variables} onToggle={() => toggle('variables')}>
        <div style={{ paddingBottom: 4 }}>
          {VARIABLES.map(v => (
            <div key={v.name} style={{
              padding: '5px 12px 5px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.025)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 11.5, color: '#d1d5db',
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {v.name}
                </span>
                <TypeBadge type={v.type} />
              </div>
              <span style={{
                fontFamily: 'monospace', fontSize: 10, lineHeight: '13px',
                color: v.sensitive ? '#f87171' : '#4b5563',
                display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {v.sensitive ? '(sensitive)' : (v.defaultValue ?? 'required')}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Locals */}
      <Section title="Locals" count={2} open={open.locals} onToggle={() => toggle('locals')}>
        <div style={{ padding: '4px 12px 8px 28px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {['name_prefix', 'common_tags'].map(name => (
            <span key={name} style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{name}</span>
          ))}
        </div>
      </Section>

      {/* Outputs */}
      <Section title="Outputs" count={7} open={open.outputs} onToggle={() => toggle('outputs')}>
        <div style={{ padding: '4px 12px 8px 28px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {['vpc_id', 'alb_dns_name', 'rds_cluster_endpoint', 'rds_reader_endpoint', 's3_bucket_name', 'web_asg_name', 'app_asg_name'].map(name => (
            <span key={name} style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{name}</span>
          ))}
        </div>
      </Section>

      {/* Providers */}
      <Section title="Providers" count={1} open={open.providers} onToggle={() => toggle('providers')}>
        <div style={{ padding: '4px 12px 8px 28px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>hashicorp/aws ~&gt; 5.0</span>
        </div>
      </Section>

      {/* Modules */}
      <Section title="Modules" open={open.modules} onToggle={() => toggle('modules')}>
        <div style={{ padding: '4px 12px 8px 28px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#374151', fontStyle: 'italic' }}>none defined</span>
        </div>
      </Section>
    </div>
  );
}
