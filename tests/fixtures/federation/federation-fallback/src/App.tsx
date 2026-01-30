import React, { Suspense, lazy } from 'react';

const RemoteComponent = lazy(() =>
  import('remote/Component')
    .catch(() => import('./FallbackComponent'))
);

export const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RemoteComponent />
  </Suspense>
);