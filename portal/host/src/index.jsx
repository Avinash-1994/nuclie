import React, { Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';

// ── Lazy-load micro frontends from separate servers ──────────────────────────
const RemoteTaskManager = React.lazy(() =>
  import('tasksApp/TaskManager').catch(() => ({ default: () => <ErrorFallback name="Task Manager" /> }))
);
const RemoteAnalytics = React.lazy(() =>
  import('analyticsApp/Analytics').catch(() => ({ default: () => <ErrorFallback name="Analytics" /> }))
);

function ErrorFallback({ name }) {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <p style={{ fontWeight: 600 }}>Could not load the {name} remote.</p>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Make sure the remote server is running.</p>
    </div>
  );
}

function LoadingSpinner({ name }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #334155', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading {name}...</p>
    </div>
  );
}

const NAV_ITEMS = [
  { key: 'tasks',     label: '📋 Task Manager',       remote: 'tasksApp' },
  { key: 'analytics', label: '📈 Analytics Dashboard', remote: 'analyticsApp' },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width: '240px', minHeight: '100vh', background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚡</div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>NexPortal</p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>MFE Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{ margin: '0 0 0.5rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Micro Frontends</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.75rem',
              borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: active === item.key ? 'linear-gradient(135deg,#3b82f620,#8b5cf620)' : 'transparent',
              color: active === item.key ? '#60a5fa' : '#94a3b8',
              fontWeight: active === item.key ? 700 : 400, fontSize: '0.9rem',
              borderLeft: active === item.key ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {item.label}
            {active === item.key && (
              <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer badge */}
      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ background: '#1e293b', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>Powered by</p>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', background: 'linear-gradient(to right,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ Nuclie MFE</p>
        </div>
      </div>
    </aside>
  );
}

function Header({ active }) {
  const titles = { tasks: 'Task Manager', analytics: 'Analytics Dashboard' };
  return (
    <header style={{ padding: '1.25rem 2rem', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{titles[active] || 'Dashboard'}</h1>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>Micro Frontend — loaded from separate remote server</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', background: '#22c55e20', color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #22c55e40' }}>● Live</span>
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', background: '#3b82f620', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600 }}>Nuclie v1.0</span>
      </div>
    </header>
  );
}

function App() {
  const [active, setActive] = useState('tasks');

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0f172a; color: #f8fafc; font-family: 'Inter', system-ui, sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar active={active} setActive={setActive} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Header active={active} />
          <main style={{ flex: 1, padding: '1rem', background: '#0f172a' }}>
            {active === 'tasks' && (
              <Suspense fallback={<LoadingSpinner name="Task Manager" />}>
                <RemoteTaskManager />
              </Suspense>
            )}
            {active === 'analytics' && (
              <Suspense fallback={<LoadingSpinner name="Analytics" />}>
                <RemoteAnalytics />
              </Suspense>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
