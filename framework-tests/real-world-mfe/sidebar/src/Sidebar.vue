<template>
  <section class="sidebar-remote">
    <div class="sidebar-card">
      <h2>Vue Sidebar Remote</h2>
      <p>This remote is built with Vue and mounted into the host container through the federated mount contract.</p>
      <ul>
        <li>Cross-framework integration</li>
        <li>Independent deployment</li>
        <li>DOM mounted into host layout</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.sidebar-remote {
  min-height: 240px;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #111827, #111827 65%, #0f172a);
  border-radius: 18px;
  border: 1px solid #334155;
}

.sidebar-card {
  max-width: 640px;
  color: #e2e8f0;
  text-align: center;
}

.sidebar-card h2 {
  margin-bottom: 0.75rem;
  color: #93c5fd;
}

.sidebar-card p {
  margin-bottom: 1rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.sidebar-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.sidebar-card li {
  background: #0f172a;
  padding: 0.8rem 1rem;
  border-radius: 9999px;
  border: 1px solid #334155;
  color: #cbd5e1;
  font-size: 0.95rem;
}
</style>
