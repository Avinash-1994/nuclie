#!/usr/bin/env node
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const req = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We just forward to the sparx package's create-sparx script
try {
  import('sparx/dist/create-sparx.js');
} catch (e) {
  console.error("Failed to load sparx's create tool. Is sparx installed?");
  process.exit(1);
}
