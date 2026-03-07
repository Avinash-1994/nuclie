import React, { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Nuclie React Test App</h1>
            <button onClick={() => setCount(c => c + 1)}>
                Count is {count}
            </button>
        </div>
    );
}
