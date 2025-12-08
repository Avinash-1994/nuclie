#!/bin/bash

# Comprehensive Project Generator for All Frameworks
# Creates production-like projects to test ALL build pipeline functionality

echo "🚀 Creating comprehensive test projects for all frameworks..."
echo ""

BASE_DIR="examples"

# Colors for output
GREEN='\033[0.32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create a comprehensive React project
create_react_complete() {
    echo -e "${BLUE}📦 Creating React Complete Project...${NC}"
    
    PROJECT="$BASE_DIR/react-complete"
    mkdir -p "$PROJECT"/{src/{components,pages,styles,utils,data},public/assets}
    
    # Already created package.json and tsconfig.json above
    
    # Main entry point
    cat > "$PROJECT/src/main.tsx" << 'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
EOF

    # App component with routing
    cat > "$PROJECT/src/App.tsx" << 'EOF'
import { Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import './styles/components.css';

// Lazy-loaded component to test code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </main>
      
      <footer className="footer">
        <p>© 2025 Urja Build Tool - React Complete Test</p>
        <p>Testing: TypeScript, Routing, Lazy Loading, HMR, Production Build</p>
      </footer>
    </div>
  );
}

export default App;
EOF

    # Header component
    cat > "$PROJECT/src/components/Header.tsx" << 'EOF'
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🚀 React Complete</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
EOF

    # Counter component
    cat > "$PROJECT/src/components/Counter.tsx" << 'EOF'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h3>Counter Component</h3>
      <p>Testing: useState, HMR, Event Handling</p>
      <div className="counter-display">
        <button onClick={() => setCount(count - 1)} className="btn btn-secondary">-</button>
        <span className="count">{count}</span>
        <button onClick={() => setCount(count + 1)} className="btn btn-primary">+</button>
      </div>
      <button onClick={() => setCount(0)} className="btn btn-outline">Reset</button>
    </div>
  );
}
EOF

    # TodoList component
    cat > "$PROJECT/src/components/TodoList.tsx" << 'EOF'
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Test TypeScript compilation', completed: true },
    { id: 2, text: 'Test HMR', completed: false },
    { id: 3, text: 'Test production build', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-card">
      <h3>Todo List Component</h3>
      <p>Testing: State Management, TypeScript, CRUD Operations</p>
      
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="input"
        />
        <button onClick={addTodo} className="btn btn-primary">Add</button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="btn-delete">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
EOF

    # Home page
    cat > "$PROJECT/src/pages/Home.tsx" << 'EOF'
import Counter from '../components/Counter';
import TodoList from '../components/TodoList';
import { getEnvInfo } from '../utils/helpers';

export default function Home() {
  const envInfo = getEnvInfo();

  return (
    <div className="page">
      <div className="hero">
        <h2>Welcome to React Complete Test</h2>
        <p>Comprehensive testing of Urja Build Tool with React + TypeScript</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h4>🎯 Build Pipeline Features</h4>
          <ul>
            <li>✅ TypeScript Compilation</li>
            <li>✅ JSX/TSX Transform</li>
            <li>✅ Hot Module Replacement</li>
            <li>✅ React Router</li>
            <li>✅ Lazy Loading</li>
            <li>✅ Code Splitting</li>
            <li>✅ CSS Imports</li>
            <li>✅ Asset Imports</li>
            <li>✅ Environment Variables</li>
            <li>✅ Production Build</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>📊 Environment Info</h4>
          <pre>{JSON.stringify(envInfo, null, 2)}</pre>
        </div>
      </div>

      <div className="components-grid">
        <Counter />
        <TodoList />
      </div>
    </div>
  );
}
EOF

    # About page
    cat > "$PROJECT/src/pages/About.tsx" << 'EOF'
import mockData from '../data/mock.json';

export default function About() {
  return (
    <div className="page">
      <h2>About This Project</h2>
      
      <div className="about-content">
        <section>
          <h3>Purpose</h3>
          <p>
            This is a comprehensive React project designed to test ALL features of the Urja build tool.
            It includes TypeScript, routing, lazy loading, state management, and more.
          </p>
        </section>

        <section>
          <h3>Features Tested</h3>
          <div className="features-grid">
            {mockData.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h4>{feature.name}</h4>
                <p>{feature.description}</p>
                <span className={`status ${feature.status}`}>{feature.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>JSON Import Test</h3>
          <p>Successfully imported and displayed data from mock.json</p>
          <pre>{JSON.stringify(mockData, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}
EOF

    # Dashboard page (lazy-loaded)
    cat > "$PROJECT/src/pages/Dashboard.tsx" << 'EOF'
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    builds: 0,
    hmrUpdates: 0,
    cacheHits: 0,
  });

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        builds: 42,
        hmrUpdates: 156,
        cacheHits: 89,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page">
      <h2>Dashboard (Lazy Loaded)</h2>
      <p>This component was lazy-loaded to test code splitting!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.builds}</h3>
          <p>Total Builds</p>
        </div>
        <div className="stat-card">
          <h3>{stats.hmrUpdates}</h3>
          <p>HMR Updates</p>
        </div>
        <div className="stat-card">
          <h3>{stats.cacheHits}</h3>
          <p>Cache Hits</p>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>Lazy Loading Test</h3>
        <p>✅ Component loaded successfully</p>
        <p>✅ Code splitting working</p>
        <p>✅ Dynamic import working</p>
      </div>
    </div>
  );
}
EOF

    # Utilities
    cat > "$PROJECT/src/utils/helpers.ts" << 'EOF'
export function getEnvInfo() {
  return {
    mode: import.meta.env.MODE || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const APP_NAME = 'React Complete Test';
export const VERSION = '1.0.0';
EOF

    # Mock data
    cat > "$PROJECT/src/data/mock.json" << 'EOF'
{
  "features": [
    {
      "name": "TypeScript",
      "description": "Full TypeScript support with type checking",
      "status": "working"
    },
    {
      "name": "React Router",
      "description": "Client-side routing with React Router",
      "status": "working"
    },
    {
      "name": "Lazy Loading",
      "description": "Code splitting with lazy loading",
      "status": "working"
    },
    {
      "name": "HMR",
      "description": "Hot Module Replacement for instant updates",
      "status": "working"
    },
    {
      "name": "CSS Imports",
      "description": "Import CSS files in components",
      "status": "working"
    },
    {
      "name": "JSON Imports",
      "description": "Import JSON files as modules",
      "status": "working"
    }
  ],
  "buildInfo": {
    "tool": "Urja",
    "framework": "React",
    "typescript": true,
    "version": "1.0.0"
  }
}
EOF

    # Global styles
    cat > "$PROJECT/src/styles/global.css" << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #646cff;
  --secondary: #42b883;
  --danger: #ff3e00;
  --dark: #1a1a1a;
  --light: #f9f9f9;
  --border: #e0e0e0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: var(--dark);
  background: var(--light);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: var(--primary);
}

.page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
EOF

    # Component styles
    cat > "$PROJECT/src/styles/components.css" << 'EOF'
/* Header */
.header {
  background: var(--primary);
  color: white;
  padding: 1rem 0;
  box-shadow: var(--shadow);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Footer */
.footer {
  background: var(--dark);
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

.footer p {
  margin: 0.5rem 0;
}

/* Hero */
.hero {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* Cards */
.info-grid, .components-grid, .features-grid, .stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.info-card, .counter-card, .todo-card, .feature-card, .stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.info-card h4, .counter-card h3, .todo-card h3 {
  margin-bottom: 1rem;
  color: var(--primary);
}

.info-card ul {
  list-style: none;
}

.info-card li {
  padding: 0.5rem 0;
}

.info-card pre {
  background: var(--light);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}

/* Counter */
.counter-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.count {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary);
  min-width: 100px;
  text-align: center;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: #535bf2;
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--secondary);
  color: white;
}

.btn-secondary:hover {
  background: #35a372;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
}

/* Todo List */
.todo-input {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.btn-delete {
  margin-left: auto;
  background: var(--danger);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}

.btn-delete:hover {
  background: #e63900;
}

/* Stats */
.stat-card {
  text-align: center;
}

.stat-card h3 {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

/* Feature cards */
.feature-card {
  position: relative;
}

.status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status.working {
  background: #d4edda;
  color: #155724;
}

/* About page */
.about-content section {
  margin: 3rem 0;
}

.about-content h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.dashboard-info {
  background: var(--light);
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.dashboard-info h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.dashboard-info p {
  margin: 0.5rem 0;
}
EOF

    # README
    cat > "$PROJECT/README.md" << 'EOF'
# React Complete - Comprehensive Build Pipeline Test

This is a production-like React project designed to test ALL features of the Urja build tool.

## Features Tested

- ✅ TypeScript compilation
- ✅ JSX/TSX transformation
- ✅ React Router (client-side routing)
- ✅ Lazy loading with Suspense
- ✅ Code splitting
- ✅ Hot Module Replacement (HMR)
- ✅ CSS imports
- ✅ JSON imports
- ✅ Environment variables
- ✅ Production build
- ✅ Tree-shaking
- ✅ Minification

## Project Structure

```
react-complete/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Route pages
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── data/           # Mock data
│   ├── App.tsx         # Main app with routing
│   └── main.tsx        # Entry point
├── public/
│   └── index.html      # HTML template
├── package.json
└── tsconfig.json
```

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Testing Checklist

- [ ] Dev server starts successfully
- [ ] All routes work (/, /about, /dashboard)
- [ ] Counter component works
- [ ] Todo list CRUD works
- [ ] Lazy loading works (Dashboard)
- [ ] HMR works (edit any file)
- [ ] TypeScript compilation works
- [ ] CSS imports work
- [ ] JSON imports work
- [ ] Production build succeeds
- [ ] Output is minified
- [ ] Code splitting works
EOF

    echo -e "${GREEN}✅ React Complete project created${NC}"
}

# Create React Complete
create_react_complete

echo ""
echo "🎉 React Complete project created successfully!"
echo ""
echo "📦 Installing dependencies..."
cd "$BASE_DIR/react-complete" && npm install

echo ""
echo "✅ Ready to test!"
echo ""
echo "To test:"
echo "  cd examples/react-complete"
echo "  npm run dev"
echo ""
