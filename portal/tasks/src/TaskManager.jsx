import React, { useState, useMemo } from 'react';

const FILTERS = [
  { key: 'ALL', label: 'All', tooltip: 'Show all tasks' },
  { key: 'T', label: 'T', tooltip: 'Today' },
  { key: 'CW', label: 'CW', tooltip: 'Current Week' },
  { key: 'CM', label: 'CM', tooltip: 'Current Month' },
  { key: 'CY', label: 'CY', tooltip: 'Current Year' },
  { key: 'PY', label: 'PY', tooltip: 'Previous Year' },
];

const isSameDay = (d) => new Date(d).toDateString() === new Date().toDateString();
const isSameWeek = (d) => {
  const n = new Date(); const s = new Date(n.setDate(n.getDate() - n.getDay()));
  return new Date(d) >= s;
};
const isSameMonth = (d) => new Date(d).getMonth() === new Date().getMonth() && new Date(d).getFullYear() === new Date().getFullYear();
const isSameYear  = (d) => new Date(d).getFullYear() === new Date().getFullYear();
const isPrevYear  = (d) => new Date(d).getFullYear() === new Date().getFullYear() - 1;

const initTasks = [
  { id: 1, title: 'Set up Module Federation', status: 'done', date: new Date().toISOString() },
  { id: 2, title: 'Build Task Manager Remote', status: 'pending', date: new Date().toISOString() },
  { id: 3, title: 'Integrate Analytics Dashboard', status: 'pending', date: new Date().toISOString() },
];

export default function TaskManager() {
  const [tasks, setTasks] = useState(initTasks);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [tooltip, setTooltip] = useState(null);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now(), title: input.trim(), status: 'pending', date: new Date().toISOString() }]);
    setInput('');
  };

  const toggle = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, status: x.status === 'done' ? 'pending' : 'done' } : x));
  const remove = (id) => setTasks(t => t.filter(x => x.id !== id));

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filter === 'T')  return isSameDay(t.date);
      if (filter === 'CW') return isSameWeek(t.date);
      if (filter === 'CM') return isSameMonth(t.date);
      if (filter === 'CY') return isSameYear(t.date);
      if (filter === 'PY') return isPrevYear(t.date);
      return true;
    });
  }, [tasks, filter]);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>📋 Task Manager</h2>
        <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Manage and track your tasks efficiently</p>
      </div>

      {/* Add Task */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task... press Enter"
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
        />
        <button
          onClick={addTask}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          + Add
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', position: 'relative' }}>
        {FILTERS.map(f => (
          <div key={f.key} style={{ position: 'relative' }}
            onMouseEnter={() => setTooltip(f.key)}
            onMouseLeave={() => setTooltip(null)}
          >
            <button
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.35rem 0.9rem', borderRadius: '20px', border: '1px solid',
                borderColor: filter === f.key ? '#3b82f6' : '#334155',
                background: filter === f.key ? '#3b82f620' : 'transparent',
                color: filter === f.key ? '#60a5fa' : '#94a3b8',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.2s'
              }}
            >{f.label}</button>
            {tooltip === f.key && (
              <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#f8fafc', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 99 }}>
                {f.tooltip}
              </div>
            )}
          </div>
        ))}
        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.85rem', alignSelf: 'center' }}>
          {filtered.filter(t => t.status === 'done').length}/{filtered.length} done
        </span>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', background: '#1e293b', borderRadius: '12px', border: '1px dashed #334155' }}>
            No tasks found for this filter.
          </div>
        )}
        {filtered.map(task => (
          <div key={task.id} style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
            background: '#1e293b', borderRadius: '12px', border: `1px solid ${task.status === 'done' ? '#22c55e30' : '#334155'}`,
            transition: 'all 0.2s', opacity: task.status === 'done' ? 0.75 : 1
          }}>
            <button onClick={() => toggle(task.id)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${task.status === 'done' ? '#22c55e' : '#475569'}`, background: task.status === 'done' ? '#22c55e' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
              {task.status === 'done' ? '✓' : ''}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: task.status === 'done' ? '#64748b' : '#f1f5f9', fontWeight: 500, textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#475569' }}>
                {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: task.status === 'done' ? '#22c55e20' : '#f59e0b20', color: task.status === 'done' ? '#4ade80' : '#fbbf24' }}>
              {task.status === 'done' ? 'Done' : 'Pending'}
            </span>
            <button onClick={() => remove(task.id)} style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem', borderRadius: '6px', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#ef4444'}
              onMouseOut={e => e.target.style.color = '#ef444460'}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
