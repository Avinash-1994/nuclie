import React, { useMemo } from 'react';

const SAMPLE_TASKS = [
  { id: 1, title: 'Setup Module Federation', status: 'done',    date: new Date().toISOString() },
  { id: 2, title: 'Build Task Manager',       status: 'done',    date: new Date().toISOString() },
  { id: 3, title: 'Analytics Dashboard',      status: 'pending', date: new Date().toISOString() },
  { id: 4, title: 'Deploy to Production',     status: 'pending', date: new Date().toISOString() },
  { id: 5, title: 'Write Tests',              status: 'done',    date: new Date().toISOString() },
  { id: 6, title: 'Code Review',              status: 'pending', date: new Date().toISOString() },
];

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${color}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.07 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: '0.5rem 0 0.25rem', fontSize: '2.5rem', fontWeight: 800, color }}>{value}</p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>{sub}</p>
    </div>
  );
}

function BarChart({ tasks }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = 6;
  const data = days.map((d, i) => ({ day: d, done: Math.floor(Math.random() * max), pending: Math.floor(Math.random() * max) }));

  return (
    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 1.5rem', color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' }}>📊 Weekly Activity</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '140px' }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: '110px' }}>
              <div style={{ flex: 1, background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '4px 4px 0 0', height: `${(d.done / max) * 100}%`, minHeight: '4px', transition: 'height 0.5s' }} title={`Done: ${d.done}`} />
              <div style={{ flex: 1, background: 'linear-gradient(to top, #f59e0b, #fbbf24)', borderRadius: '4px 4px 0 0', height: `${(d.pending / max) * 100}%`, minHeight: '4px', transition: 'height 0.5s' }} title={`Pending: ${d.pending}`} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{d.day}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px', display: 'inline-block' }} /> Completed</span>
        <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px', display: 'inline-block' }} /> Pending</span>
      </div>
    </div>
  );
}

function PieChart({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const r = 50, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{ margin: '0 0 1rem', color: '#f1f5f9', fontWeight: 700, fontSize: '1rem', alignSelf: 'flex-start' }}>🍩 Completion Rate</h3>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#334155" strokeWidth="18" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#grad)" strokeWidth="18"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <text x="65" y="65" textAnchor="middle" dominantBaseline="middle" fill="#f8fafc" fontSize="20" fontWeight="800">{pct}%</text>
      </svg>
      <p style={{ margin: '0.75rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>{done} of {total} tasks completed</p>
    </div>
  );
}

export default function Analytics() {
  const tasks = SAMPLE_TASKS;
  const done = tasks.filter(t => t.status === 'done').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>📈 Analytics Dashboard</h2>
        <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Real-time task performance insights</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Tasks" value={tasks.length} color="#60a5fa" icon="📋" sub="All time" />
        <StatCard label="Completed" value={done} color="#4ade80" icon="✅" sub={`${Math.round((done/tasks.length)*100)}% of total`} />
        <StatCard label="Pending" value={pending} color="#fbbf24" icon="⏳" sub="Needs attention" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <BarChart tasks={tasks} />
        <PieChart done={done} total={tasks.length} />
      </div>

      {/* Recent List */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155', marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' }}>🕐 Recent Tasks</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#0f172a' }}>
              <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{t.title}</span>
              <span style={{ padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: t.status === 'done' ? '#22c55e20' : '#f59e0b20', color: t.status === 'done' ? '#4ade80' : '#fbbf24' }}>
                {t.status === 'done' ? '✓ Done' : '⏳ Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
