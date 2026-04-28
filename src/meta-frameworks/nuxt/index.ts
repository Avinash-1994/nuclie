import * as path from 'path';
import * as fs from 'fs';

export interface NuxtAdapterOptions {
  ssr?: boolean;
  ssg?: string[];
  autoImports?: boolean;
}

export class NuxtAdapter {
  private nitroBridgeActive = false;
  private activeRoutes: string[] = [];
  
  constructor(private rootPath: string, private options: NuxtAdapterOptions = {}) {
    // Setup Nitro bridge for server API routes
    this.nitroBridgeActive = true;
  }

  /**
   * Generates Nitro API route manifest and sets up the server bridge
   */
  async setupNitroBridge() {
    try {
      const apiDir = path.join(this.rootPath, 'server', 'api');
      if (fs.existsSync(apiDir)) {
        const files: string[] = fs.readdirSync(apiDir);
        this.activeRoutes = files.map((f: string) => '/api/' + f.replace('.ts', ''));
      }
    } catch(e) {}
    
    return {
      active: this.nitroBridgeActive,
      routes: this.activeRoutes || []
    };
  }

  /**
   * Generates custom Vue Router configurations based on the pages/ directory structure
   */
  generateRoutingManifest() {
    let routesStr = '';
    try {
      const pagesDir = path.join(this.rootPath, 'pages');
      if (fs.existsSync(pagesDir)) {
        const files: string[] = fs.readdirSync(pagesDir).filter((f: string) => f.endsWith('.vue'));
        files.forEach((f: string) => {
          const route = f === 'index.vue' ? '/' : '/' + f.replace('.vue', '');
          routesStr += `{ path: '${route}', component: () => import('~/pages/${f}') },\n`;
        });
      }
    } catch(e) {}
    
    return `
      import { createRouter, createWebHistory } from 'vue-router';
      // Auto-generated routes from pages/ directory
      const routes = [\n${routesStr}      ];
      export const router = createRouter({
        history: createWebHistory(),
        routes
      });
    `;
  }

  /**
   * SSR renderer stub for Nuxt apps
   */
  async renderToString(url: string, storeState: any = {}) {
    // Emulates rendering a Nuxt Vue component to string + pinia hydration script
    const piniaState = JSON.stringify(storeState);
    return `
      <div id="__nuxt">
        <div data-server-rendered="true">Nuxt SSR Content for ${url}</div>
      </div>
      <script>window.__NUXT__ = { state: ${piniaState} };</script>
    `;
  }

  createPlugin() {
    return {
      name: 'sparx-nuxt-adapter',
      setup: async () => {
        await this.setupNitroBridge();
      },
      transform: (code: string, id: string) => {
        // Auto-inject auto-imports into Vue components
        if (id.endsWith('.vue') && this.options.autoImports !== false) {
          return `import { ref, computed, watch, useRoute, useRouter } from 'vue';\n` + code;
        }
        return null;
      }
    };
  }
}
