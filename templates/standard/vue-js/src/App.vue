<template>
<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#42b883'}}>+ Vue</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive Vue</h3>
          <p><button class="interactive-btn" @click="count++">Count is: {{ count }}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
</script>