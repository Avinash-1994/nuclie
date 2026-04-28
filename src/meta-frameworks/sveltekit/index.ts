import * as path from 'path';
import * as fs from 'fs';
import type { SparxAdapter, Plugin, SparxConfig, PackageJson } from '@sparx/adapter-core';
import { registry } from '@sparx/adapter-core';

export class SvelteKitAdapter implements SparxAdapter {
  name = 'svelte-kit';
  private routesPath: string;

  constructor(private rootPath: string = process.cwd()) {
    this.routesPath = path.join(this.rootPath, 'src', 'routes');
  }

  detect(projectRoot: string, pkg: PackageJson): boolean {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return !!deps['@sveltejs/kit'];
  }

  plugins(): Plugin[] {
    return [];
  }

  config(config: SparxConfig): SparxConfig {
    return config;
  }

  ssrEntry(config: SparxConfig): string {
    return path.join(config.root || process.cwd(), 'src', 'entry-server.js');
  }

  /**
   * Scans the src/routes directory to extract the routing manifest
   */
  generateManifest() {
    const manifest: any = {
      pages: [],
      endpoints: [],
      layouts: [],
      dynamic: []
    };

    if (!fs.existsSync(this.routesPath)) return manifest;

    const walk = (dir: string, baseRoute: string) => {
      const files = fs.readdirSync(dir);
      
      const routeData = {
        path: baseRoute === '' ? '/' : baseRoute,
        page: false,
        serverLoad: false,
        actions: false,
        apiEndpoint: false
      };

      if (routeData.path.includes('[')) manifest.dynamic.push(routeData.path);

      files.forEach(f => {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath, baseRoute + '/' + f);
        } else {
          if (f === '+page.svelte') routeData.page = true;
          if (f.startsWith('+layout')) manifest.layouts.push(path.join(baseRoute, f));
          if (f === '+page.server.ts') {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('export async function load') || content.includes('export function load')) {
              routeData.serverLoad = true;
            }
            if (content.includes('export const actions =')) {
              routeData.actions = true;
            }
          }
          if (f === '+server.ts') {
            routeData.apiEndpoint = true;
          }
        }
      });

      if (routeData.page) manifest.pages.push(routeData);
      if (routeData.apiEndpoint) manifest.endpoints.push(routeData);
    };

    walk(this.routesPath, '');
    return manifest;
  }

  /**
   * Evaluates a +page.server.ts file natively to test load/action outputs
   * In Sparx, this is bundled via esbuild, but for the adapter tests we dynamically parse it
   */
  async evaluateServerNode(filePath: string, mockRequest: any, mockCookies: any) {
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    
    // For test simulation, we transpile it slightly to execute the logic in Node natively
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove sveltejs imports that crash in node
    content = content.replace(/import { redirect } from '@sveltejs\/kit';/, 'class Redirect { constructor(s,l){this.status=s;this.location=l;} }; const redirect = (s,l) => new Redirect(s,l);');
    
    // Very dirty eval just for testing the logic extracted by adapter
    const mockModule: any = {};
    const evalCode = `
      ${content.replace(/export async function load/g, 'mockModule.load = async function load')
               .replace(/export const actions =/g, 'mockModule.actions =')}
    `;
    
    try {
      eval(evalCode);
      
      let loadResult = null;
      let actionResult = null;
      let redirectResult = null;

      if (mockModule.load) {
        try {
          loadResult = await mockModule.load({ cookies: mockCookies });
        } catch(e: any) {
          if (e.status === 302) redirectResult = e.location;
        }
      }

      if (mockModule.actions && mockModule.actions.default) {
        actionResult = await mockModule.actions.default({ request: mockRequest });
      }

      return { loadResult, actionResult, redirectResult };
    } catch(e) {
      console.error(e);
      return null;
    }
  }

  createPlugin() {
    return {
      name: 'sparx-sveltekit-adapter',
      setup: () => {},
      transform: (code: string, id: string) => { return null; }
    };
  }
}

registry.register(new SvelteKitAdapter());
