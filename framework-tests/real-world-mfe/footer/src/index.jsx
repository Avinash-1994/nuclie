import React from 'react';
import { createRoot } from 'react-dom/client';
import Footer from './Footer.jsx';

let root = null;

export function mount(container) {
  if (!container) return;
  root = createRoot(container);
  root.render(<Footer />);
  return () => {
    if (root) {
      root.unmount();
      root = null;
    }
  };
}

export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

export default mount;
