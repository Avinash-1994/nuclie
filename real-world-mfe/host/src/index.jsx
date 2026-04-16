import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log("REACT LOADED:", React);
console.log("CREATEROOT LOADED:", createRoot);

if (!createRoot) {
  document.getElementById('root').innerHTML = '<h1>Error: createRoot is missing.</h1>';
} else {
  createRoot(document.getElementById('root')).render(<App />);
}

