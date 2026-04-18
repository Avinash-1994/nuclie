import Alpine from 'alpinejs';

// Alpine.js store for global state
Alpine.store('app', {
  version: 'v1.0.0',
  framework: 'Alpine.js',
  count: 0,
  increment() {
    this.count++;
  },
  decrement() {
    if (this.count > 0) this.count--;
  }
});

// Mount Alpine
(window as any).Alpine = Alpine;
Alpine.start();

// Build the UI
const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <div x-data style="font-family: system-ui, sans-serif; background: #0f172a; min-height: 100vh; color: #e2e8f0;">
      <div style="text-align: center; padding: 4rem 2rem 2rem;">
        <span style="background: #6366f1; color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">
          v1.0.0 Stable — Alpine.js
        </span>
        <h1 style="font-size: 3rem; font-weight: 800; margin: 1rem 0 0.5rem; background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Sparx (Alpine)
        </h1>
        <p style="color: #94a3b8; font-size: 1.1rem; max-width: 500px; margin: 0 auto; line-height: 1.6;">
          The high-performance build engine for modern web applications.<br />
          Engineered for speed. Built for stability.
        </p>
      </div>

      <div x-data="{ count: 0 }" style="text-align: center; padding: 1rem;">
        <p style="color: #94a3b8; margin-bottom: 1rem;">Interactive Alpine Counter:</p>
        <button @click="count--" style="background: #334155; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; margin: 0 0.5rem;">−</button>
        <span x-text="count" style="font-size: 1.5rem; font-weight: bold; color: #6366f1; margin: 0 1rem;">0</span>
        <button @click="count++" style="background: #6366f1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; margin: 0 0.5rem;">+</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; padding: 2rem; max-width: 900px; margin: 0 auto;">
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem;">
          <h3 style="color: #6366f1; margin: 0 0 0.5rem;">HTML-First</h3>
          <p style="color: #94a3b8; margin: 0; font-size: 0.9rem; line-height: 1.5;">Alpine.js reactivity sprinkled directly into your HTML markup.</p>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem;">
          <h3 style="color: #6366f1; margin: 0 0 0.5rem;">Sub-100ms HMR</h3>
          <p style="color: #94a3b8; margin: 0; font-size: 0.9rem; line-height: 1.5;">Instant feedback loop with state preservation.</p>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem;">
          <h3 style="color: #6366f1; margin: 0 0 0.5rem;">Native Core</h3>
          <p style="color: #94a3b8; margin: 0; font-size: 0.9rem; line-height: 1.5;">Rust-powered hashing and scanning for lightning-fast builds.</p>
        </div>
      </div>

      <div style="text-align: center; padding: 1rem; color: #64748b; font-size: 0.85rem;">
        Powered by Sparx Build Tool · Alpine.js Adapter
      </div>
    </div>
  `;
}
