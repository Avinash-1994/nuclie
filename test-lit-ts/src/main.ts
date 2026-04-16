import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nuclie-app')
export class NuclieApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
      background: #0f172a;
      min-height: 100vh;
      color: #e2e8f0;
    }
    .hero {
      text-align: center;
      padding: 4rem 2rem 2rem;
    }
    .badge {
      background: #6366f1;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    h1 {
      font-size: 3rem;
      font-weight: 800;
      margin: 1rem 0 0.5rem;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .feature-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .feature-card h3 {
      color: #6366f1;
      margin: 0 0 0.5rem;
    }
    .feature-card p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .framework-badge {
      text-align: center;
      padding: 1rem;
      color: #64748b;
      font-size: 0.85rem;
    }
  `;

  @property({ type: String }) framework = 'Lit';

  render() {
    return html`
      <div class="hero">
        <span class="badge">v1.0.0 Stable — ${this.framework}</span>
        <h1>Nuclie (Lit)</h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br />
          Engineered for speed. Built for stability.
        </p>
      </div>
      <div class="features">
        <div class="feature-card">
          <h3>Web Components</h3>
          <p>Lit-powered custom elements with reactive properties and scoped styles.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
      </div>
      <div class="framework-badge">Powered by Nuclie Build Tool · ${this.framework} Adapter</div>
    `;
  }
}

// Mount
const root = document.getElementById('root');
if (root) {
  const app = document.createElement('nuclie-app');
  root.appendChild(app);
}
