import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
<div className="app-container">
      <header className="hero">
        <span className="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#61dafb'}}>+ React</span></h1>
        <p className="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main className="features">
        <div className="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div className="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive React</h3>
          <p><button className="interactive-btn" onClick={() => setCount(c => c + 1)}>Count is: {count}</button></p>
        </div>
      </main>
      <div className="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer className="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
  );
}

export default App;