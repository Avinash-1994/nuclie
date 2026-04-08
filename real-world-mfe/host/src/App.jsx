import React, { Suspense } from 'react';

// Dynamically import the Header from our "navApp" Micro Frontend
const RemoteHeader = React.lazy(() => import('navApp/Header').then(module => {
    return { default: module.default || module };
}));

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      <Suspense fallback={<div style={{ padding: '1rem', textAlign: 'center', background: '#1e293b' }}>Loading Navigation...</div>}>
        <RemoteHeader />
      </Suspense>
      
      <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
          <span style={{ background: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Micro Frontend Host
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to the Real-World MFE Architecture
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: '1.7', maxWidth: '700px' }}>
            This application demonstrates true module federation. The navigation bar running at the top of the page is independently deployed, downloaded asynchronously at runtime, and seamlessly integrated into the DOM via the <strong>Nuclie</strong> shared module registry.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
            {[
              { title: 'Isolated Bundles', desc: 'Remote apps are compiled entirely independently.' },
              { title: 'Dynamic Injection', desc: 'The host fetches the remote module dynamically.' },
              { title: 'Shared Singletons', desc: 'React and ReactDOM are deduplicated automatically.' }
            ].map(feature => (
              <div key={feature.title} style={{ padding: '1.5rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{feature.title}</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
