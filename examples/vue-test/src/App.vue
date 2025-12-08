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
