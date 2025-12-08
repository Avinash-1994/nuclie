import { useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>🚀 Urja Build Tool - Preact Test</h1>
      <p>Framework: Preact</p>
      <p>Universal Transformer: ✅ Active</p>
      <p>Version-Agnostic: ✅ Enabled</p>
      
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        <p>Click the button to test reactivity!</p>
      </div>

      <div className="features">
        <h2>✨ Features Working:</h2>
        <ul>
          <li>✅ Preact 10</li>
          <li>✅ Hooks</li>
          <li>✅ Fast Refresh</li>
          <li>✅ Lightweight Bundle</li>
          <li>✅ Universal Transformer</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
