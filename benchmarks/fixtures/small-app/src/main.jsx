// Benchmark fixture: small-app
// 50 components, ~200 modules — for cold-start and HMR timing

import React from 'react';
import { createRoot } from 'react-dom/client';

// Simulate 50 components inline for benchmark purposes
const components = Array.from({ length: 50 }, (_, i) => {
  const Component = () => React.createElement('div', { className: `comp-${i}` }, `Component ${i}`);
  Component.displayName = `BenchComp${i}`;
  return Component;
});

function SmallApp() {
  return React.createElement(
    'div',
    { id: 'small-app' },
    ...components.map((C, i) => React.createElement(C, { key: i }))
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(React.createElement(SmallApp));
}
