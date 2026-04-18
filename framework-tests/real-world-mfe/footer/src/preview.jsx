import React from 'react';
import { createRoot } from 'react-dom/client';
import Footer from './Footer.jsx';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Footer />);
}
