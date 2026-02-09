import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Unused export to test tree shaking
export const UNUSED_CONSTANT = 'This should be removed in production';

function unusedFunction() {
    console.log('This function is never called and should be tree-shaken');
    return UNUSED_CONSTANT;
}

// Component to test JSX, hooks, and source maps
function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(c => c + 1);
    };

    return (
        <div className="counter">
            <h1>Production Test App</h1>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <p className="info">
                This app tests:
                - React JSX transformation
                - Source maps
                - Tree shaking (unused code above)
                - Minification
            </p>
        </div>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Counter />);
