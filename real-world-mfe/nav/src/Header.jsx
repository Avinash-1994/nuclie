import React from 'react';

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'linear-gradient(90deg, #111827, #1f2937)',
      borderBottom: '1px solid #374151',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>N</div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.025em' }}>Nexus Portal</h2>
      </div>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        {['Dashboard', 'Analytics', 'Settings'].map(tab => (
          <a key={tab} href="#" style={{
            color: '#d1d5db',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'color 0.2s',
            cursor: 'pointer'
          }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#d1d5db'}>
            {tab}
          </a>
        ))}
      </nav>
      <div>
        <button style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          Profile
        </button>
      </div>
    </header>
  );
}
