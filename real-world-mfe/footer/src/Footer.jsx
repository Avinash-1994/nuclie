import React from 'react';
import { createRoot } from 'react-dom/client';

export default function Footer() {
  return (
    <footer style={{
      padding: '2rem',
      marginTop: '2rem',
      background: 'linear-gradient(135deg, #111827, #111827 60%, #0f172a)',
      color: '#cbd5e1',
      borderTop: '1px solid #334155',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>Footer Micro App</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#94a3b8' }}>
              Rendered independently and loaded by the host as a second remote app.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: '9999px', background: '#1e293b', color: '#f8fafc', fontSize: '0.85rem' }}>Shared React</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '14px', border: '1px solid #334155' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f8fafc' }}>Independent Deploy</strong>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>Footer app runs on its own port.</p>
          </div>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '14px', border: '1px solid #334155' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f8fafc' }}>Dynamic Load</strong>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>Loaded only when the host imports it.</p>
          </div>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '14px', border: '1px solid #334155' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f8fafc' }}>Federated API</strong>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>Exposed via remoteEntry.js.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

let root = null;
export function mount(container) {
  if (!container) return;
  root = createRoot(container);
  root.render(<Footer />);
  return () => {
    if (root) {
      root.unmount();
      root = null;
    }
  };
}

export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}
