import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      color: #ffffff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
    }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%; }
    .navbar-brand { font-size: 1.5rem; font-weight: 900; letter-spacing: 0.1em; color: #fff; text-decoration: none; font-family: 'Arial Black', Impact, sans-serif; text-transform: uppercase; }
    .navbar-links { display: flex; gap: 2rem; align-items: center; }
    .nav-link { color: #94a3b8; text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
    .nav-link:hover { color: #ffffff; }
    .nav-btn { background: var(--primary); color: #000; border: none; padding: 0.6rem 1.25rem; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 15px rgba(48, 140, 253, 0.4); }
    .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(48, 140, 253, 0.6); filter: brightness(1.1); }
    .hero-section { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 4rem 1rem; max-width: 800px; margin: 0 auto; flex: 1; }
    .badge { background: rgba(48, 140, 253, 0.1); color: var(--primary); padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(48, 140, 253, 0.2); margin-bottom: 2rem; display: inline-block; backdrop-filter: blur(4px); box-shadow: 0 0 20px rgba(48, 140, 253, 0.1); }
    .hero-title { font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1; margin: 0 0 1.5rem 0; letter-spacing: -0.02em; }
    .hero-title .highlight { color: var(--primary); text-shadow: 0 0 30px rgba(48, 140, 253, 0.4); }
    .hero-subtitle { font-size: clamp(1rem, 2vw, 1.15rem); color: #94a3b8; line-height: 1.6; margin: 0 auto 3rem; max-width: 600px; }
    .action-buttons { display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 4rem; flex-wrap: wrap; }
    .btn-primary { background: var(--primary); color: #000; border: none; padding: 0.8rem 2rem; border-radius: 9999px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 20px rgba(48, 140, 253, 0.4), inset 0 -2px 0 rgba(0,0,0,0.2); }
    .btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 30px rgba(48, 140, 253, 0.6), inset 0 -2px 0 rgba(0,0,0,0.2); filter: brightness(1.1); }
    .btn-secondary { background: transparent; color: #ffffff; border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 2rem; border-radius: 9999px; font-weight: 500; font-size: 1rem; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
    .btn-secondary:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }
    .terminal-window { background: #0f172a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); width: 100%; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: left; }
    .terminal-header { background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.02); }
    .term-dot { width: 12px; height: 12px; border-radius: 50%; }
    .term-dot.red { background: #ef4444; }
    .term-dot.yellow { background: #f59e0b; }
    .term-dot.green { background: #10b981; }
    .terminal-body { padding: 1.5rem; font-family: 'Fira Code', 'JetBrains Mono', monospace; font-size: 0.9rem; line-height: 1.7; }
    .term-comment { color: #64748b; }
    .term-cmd { color: #e2e8f0; }
    .term-prompt { color: #ec4899; margin-right: 0.5rem; }
    .term-success { color: #10b981; }
  `;

  @property() count = 0;

  render() {
    return html`
      <nav class="navbar">
        <a href="/" class="navbar-brand">NUCLIE</a>
        <div class="navbar-links">
          <a href="#" class="nav-link">Features</a>
          <a href="#" class="nav-link">Docs</a>
          <button class="nav-btn">Get Started</button>
        </div>
      </nav>

      <main class="hero-section">
        <div class="badge">v1.0.0 Stable</div>
        
        <h1 class="hero-title">
          The Nucleus for<br/>
          Stunning Web Apps <span class="highlight">Lit</span>
        </h1>
        
        <p class="hero-subtitle">
          Experience the next generation of build speed with Nuclie. 
          Instant HMR, native performance, and a developer experience that feels like magic.
        </p>

        <div class="action-buttons">
          <button class="btn-primary" @click=${() => this.count++}>
            Interactions: ${this.count}
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
            <span class="term-comment">// Initializing the nucleus...</span><br/>
            <span class="term-prompt">$</span><span class="term-cmd">npm install -g nuclie</span><br/>
            <span class="term-prompt">$</span><span class="term-cmd">npm run dev</span><br/><br/>
            <span class="term-success">✓ Core Ready in 3.15ms</span>
          </div>
        </div>
      </main>
    `;
  }
}