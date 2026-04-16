import React, { Suspense, useEffect, useRef, useState } from 'react';

export function RemoteComponent({ loader, fallback }) {
  const Component = React.useMemo(() => React.lazy(loader), [loader]);

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

export function RemoteMount({ loader, fallback, style, className }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    let cleanup;

    loader()
      .then((module) => {
        if (!isActive) return;

        const mountFn = module.mount || module.default?.mount;
        const unmountFn = module.unmount || module.default?.unmount;

        if (typeof mountFn !== 'function') {
          setError('Remote module must export mount(container)');
          return;
        }

        const result = mountFn(ref.current);
        if (typeof result === 'function') {
          cleanup = result;
        } else if (typeof unmountFn === 'function') {
          cleanup = unmountFn;
        }
      })
      .catch((err) => {
        setError(err.message || String(err));
      });

    return () => {
      isActive = false;
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loader]);

  return (
    <div ref={ref} className={className} style={style}>
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : fallback}
    </div>
  );
}
