import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './Button';

createRoot(document.getElementById('root')!).render(
  <Button onClick={() => console.log('Clicked')}>
    Host Button
  </Button>
);