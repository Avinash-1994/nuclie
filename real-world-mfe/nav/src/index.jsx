import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header.jsx';

const App = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif' }}>
    <Header />
    <div style={{ padding: '2rem' }}>
      <h1>Nav Application [Standalone]</h1>
      <p>This is the isolated remote for the navigation micro frontend.</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(<App />);
