import { loadRemoteModule } from './loadRemote';

async function init() {
  const module = await loadRemoteModule('host', 'Button');
  if (module) {
    console.log('Remote module loaded successfully');
  }
}

init();