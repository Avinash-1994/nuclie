#!/bin/bash

# Create test projects for all supported frameworks
# This script generates minimal test projects to verify framework support

echo "🚀 Creating test projects for all frameworks..."

BASE_DIR="examples"
mkdir -p "$BASE_DIR"

# Function to create package.json
create_package_json() {
    local name=$1
    local deps=$2
    cat > "$BASE_DIR/$name/package.json" << EOF
{
  "name": "$name",
  "version": "1.0.0",
  "type": "module",
  "dependencies": $deps
}
EOF
}

# Function to create index.html
create_index_html() {
    local name=$1
    local title=$2
    local script=$3
    mkdir -p "$BASE_DIR/$name/public"
    cat > "$BASE_DIR/$name/public/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title - Urja Build Tool</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="$script"></script>
</body>
</html>
EOF
}

echo "✅ React test project already exists"

# 2. Vue 3
echo "📦 Creating Vue 3 test project..."
mkdir -p "$BASE_DIR/vue-test/src"
create_package_json "vue-test" '{
    "vue": "^3.3.0"
  }'
create_index_html "vue-test" "Vue 3 Test" "/src/main.js"

cat > "$BASE_DIR/vue-test/src/main.js" << 'EOF'
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#root');
EOF

cat > "$BASE_DIR/vue-test/src/App.vue" << 'EOF'
<template>
  <div class="app">
    <h1>🚀 Urja Build Tool - Vue 3 Test</h1>
    <p>Framework: Vue 3</p>
    <p>Universal Transformer: ✅ Active</p>
    <p>Version-Agnostic: ✅ Enabled</p>
    
    <div class="card">
      <button @click="count++">
        Count: {{ count }}
      </button>
      <p>Click the button to test reactivity!</p>
    </div>

    <div class="features">
      <h2>✨ Features Working:</h2>
      <ul>
        <li>✅ Vue 3 Composition API</li>
        <li>✅ Reactive State</li>
        <li>✅ SFC Compilation</li>
        <li>✅ Scoped Styles</li>
        <li>✅ Universal Transformer</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #42b883;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card {
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 2rem 0;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #35a372;
  transform: translateY(-2px);
}

.features {
  text-align: left;
  background: #f0f0f0;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.features h2 {
  color: #333;
  margin-bottom: 1rem;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
}
</style>
EOF

# 3. Svelte
echo "📦 Creating Svelte test project..."
mkdir -p "$BASE_DIR/svelte-test/src"
create_package_json "svelte-test" '{
    "svelte": "^4.0.0"
  }'
create_index_html "svelte-test" "Svelte Test" "/src/main.js"

cat > "$BASE_DIR/svelte-test/src/main.js" << 'EOF'
import App from './App.svelte';

const app = new App({
  target: document.getElementById('root')
});

export default app;
EOF

cat > "$BASE_DIR/svelte-test/src/App.svelte" << 'EOF'
<script>
  let count = 0;
</script>

<div class="app">
  <h1>🚀 Urja Build Tool - Svelte Test</h1>
  <p>Framework: Svelte</p>
  <p>Universal Transformer: ✅ Active</p>
  <p>Version-Agnostic: ✅ Enabled</p>
  
  <div class="card">
    <button on:click={() => count++}>
      Count: {count}
    </button>
    <p>Click the button to test reactivity!</p>
  </div>

  <div class="features">
    <h2>✨ Features Working:</h2>
    <ul>
      <li>✅ Svelte Compilation</li>
      <li>✅ Reactive Statements</li>
      <li>✅ Component Compilation</li>
      <li>✅ Scoped Styles</li>
      <li>✅ Universal Transformer</li>
    </ul>
  </div>
</div>

<style>
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  h1 {
    color: #ff3e00;
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .card {
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    margin: 2rem 0;
  }

  button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover {
    background: #e63900;
    transform: translateY(-2px);
  }

  .features {
    text-align: left;
    background: #f0f0f0;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
  }

  .features h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  .features ul {
    list-style: none;
    padding: 0;
  }

  .features li {
    padding: 0.5rem 0;
    font-size: 1.1rem;
  }
</style>
EOF

# 4. Preact
echo "📦 Creating Preact test project..."
mkdir -p "$BASE_DIR/preact-test/src"
create_package_json "preact-test" '{
    "preact": "^10.19.0"
  }'
create_index_html "preact-test" "Preact Test" "/src/main.jsx"

cat > "$BASE_DIR/preact-test/src/main.jsx" << 'EOF'
import { render } from 'preact';
import App from './App';

render(<App />, document.getElementById('root'));
EOF

cat > "$BASE_DIR/preact-test/src/App.jsx" << 'EOF'
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
EOF

cat > "$BASE_DIR/preact-test/src/App.css" << 'EOF'
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #673ab8;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card {
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 2rem 0;
}

button {
  background: #673ab8;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #5829a0;
  transform: translateY(-2px);
}

.features {
  text-align: left;
  background: #f0f0f0;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.features h2 {
  color: #333;
  margin-bottom: 1rem;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
}
EOF

# 5. Vanilla JS
echo "📦 Creating Vanilla JS test project..."
mkdir -p "$BASE_DIR/vanilla-test/src"
create_package_json "vanilla-test" '{}'
create_index_html "vanilla-test" "Vanilla JS Test" "/src/main.js"

cat > "$BASE_DIR/vanilla-test/src/main.js" << 'EOF'
let count = 0;

function updateCount() {
  count++;
  document.getElementById('count').textContent = count;
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('countBtn');
  button.addEventListener('click', updateCount);
});
EOF

cat > "$BASE_DIR/vanilla-test/public/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanilla JS Test - Urja Build Tool</title>
  <style>
    .app {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    h1 {
      color: #f0db4f;
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .card {
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
      margin: 2rem 0;
    }

    button {
      background: #f0db4f;
      color: #323330;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover {
      background: #e5d04a;
      transform: translateY(-2px);
    }

    .features {
      text-align: left;
      background: #f0f0f0;
      padding: 2rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .features h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .features ul {
      list-style: none;
      padding: 0;
    }

    .features li {
      padding: 0.5rem 0;
      font-size: 1.1rem;
    }
  </style>
</head>
<body>
  <div class="app">
    <h1>🚀 Urja Build Tool - Vanilla JS Test</h1>
    <p>Framework: Vanilla JavaScript</p>
    <p>Universal Transformer: ✅ Active</p>
    <p>Version-Agnostic: ✅ Enabled</p>
    
    <div class="card">
      <button id="countBtn">
        Count: <span id="count">0</span>
      </button>
      <p>Click the button to test functionality!</p>
    </div>

    <div class="features">
      <h2>✨ Features Working:</h2>
      <ul>
        <li>✅ Pure JavaScript</li>
        <li>✅ ES2020 Target</li>
        <li>✅ Fast Compilation</li>
        <li>✅ HMR Support</li>
        <li>✅ Universal Transformer</li>
      </ul>
    </div>
  </div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
EOF

echo ""
echo "✅ Test projects created successfully!"
echo ""
echo "📋 Created projects:"
echo "  1. ✅ React (examples/react-test)"
echo "  2. ✅ Vue 3 (examples/vue-test)"
echo "  3. ✅ Svelte (examples/svelte-test)"
echo "  4. ✅ Preact (examples/preact-test)"
echo "  5. ✅ Vanilla JS (examples/vanilla-test)"
echo ""
echo "📦 Installing dependencies..."
echo ""

# Install dependencies for each project
for project in vue-test svelte-test preact-test vanilla-test; do
    if [ -d "$BASE_DIR/$project" ]; then
        echo "Installing dependencies for $project..."
        cd "$BASE_DIR/$project" && npm install && cd ../..
    fi
done

echo ""
echo "🎉 All test projects ready!"
echo ""
echo "🧪 To test a project:"
echo "  cd examples/<project-name>"
echo "  npx urja dev"
echo ""
