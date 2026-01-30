import React, { Suspense, lazy } from 'react';

// Dynamically import remote module
const RemoteButton = lazy(() => 
  import('host/Button').catch(() => ({
    default: () => <button>Fallback Button</button>
  }))
);

export const App = () => {
  return (
    <div>
      <h1>Consumer App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton>Remote Button</RemoteButton>
      </Suspense>
    </div>
  );
};