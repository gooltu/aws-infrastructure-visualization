import Editor from '@monaco-editor/react';
import { terraformMainTf } from '../data/terraformCode';

export default function RightPanel() {
  return (
    <div style={{
      width: 400, flexShrink: 0, height: '100%',
      background: '#0d0d1a', borderLeft: '1px solid #1e1e2e',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        height: 36, borderBottom: '1px solid #1e1e2e', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>
          main.tf
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#374151', letterSpacing: '0.3px' }}>
          HCL
        </span>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language="hcl"
          theme="vs-dark"
          value={terraformMainTf}
          loading={<div style={{ width: '100%', height: '100%', background: '#1e1e1e' }} />}
          options={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            padding: { top: 10, bottom: 10 },
            overviewRulerLanes: 0,
            folding: true,
            wordWrap: 'off',
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
