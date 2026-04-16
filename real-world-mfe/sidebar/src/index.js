import { createApp } from 'vue';
import Sidebar from './Sidebar.vue';

let app = null;

export function mount(container) {
  if (!container) return;
  app = createApp(Sidebar);
  app.mount(container);
  return () => {
    if (app) {
      app.unmount();
      app = null;
    }
  };
}

export function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }
}

export default mount;
