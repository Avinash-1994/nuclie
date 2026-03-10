import { component$, useSignal, render } from '@builder.io/qwik';
import '@builder.io/qwik/qwikloader.js';
import './index.css';

const App = component$(() => {
  const count = useSignal(0);

  return (
    <div>
      <nav class="navbar">
        <a href="/" class="navbar-brand">NUCLIE</a>
        <div class="navbar-links">
          <a href="#" class="nav-link">Features</a>
          <a href="#" class="nav-link">Docs</a>
          <button class="nav-btn">Get Started</button>
        </div>
      </nav>

      <main class="hero-section">
        <div class="badge">Engine v1.0.8 Ready</div>

        <h1 class="hero-title">
          The Nucleus for<br />
          <span class="highlight">Stunning Web Apps</span>
        </h1>

        <p class="hero-subtitle">
          Experience the next generation of build speed with Nuclie.
          Instant HMR, native performance, and a developer experience that feels like magic.
        </p>

        <div class="action-buttons">
          <button class="btn-primary" onClick$={() => count.value++}>
            Interactions: {count.value}
          </button>
          <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer" class="btn-secondary">
            Read Documentation
          </a>
        </div>

        <div class="terminal-window">
          <div class="terminal-header">
            <div class="term-dot red"></div>
            <div class="term-dot yellow"></div>
            <div class="term-dot green"></div>
          </div>
          <div class="terminal-body">
            <span class="term-comment">// Initializing the nucleus...</span><br />
            <span class="term-prompt">$</span><span class="term-cmd">npm install nuclie</span><br />
            <span class="term-prompt">$</span><span class="term-cmd">npm run dev</span><br /><br />
            <span class="term-success">✓ Core Ready in 3.15ms</span>
          </div>
        </div>
      </main>
    </div>
  );
});

export default App;

// Mount the app
if (typeof document !== 'undefined') {
  render(document.getElementById('root')!, <App />);
}