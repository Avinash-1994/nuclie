import Banner from './Banner.svelte';
import { mount as svelte_mount, unmount as svelte_unmount } from 'svelte';

let app = null;

export function mount(container) {
  if (!container) return;
  app = svelte_mount(Banner, { target: container });
  return () => {
    if (app) {
      svelte_unmount(app);
      app = null;
    }
  };
}

export function unmount() {
  if (app) {
    svelte_unmount(app);
    app = null;
  }
}

// Direct preview support when opening the banner app standalone
if (typeof window !== 'undefined' && document.getElementById('root')) {
  mount(document.getElementById('root'));
}

export default mount;
