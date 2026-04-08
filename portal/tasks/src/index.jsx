import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskManager from './TaskManager.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><TaskManager /></React.StrictMode>
);
