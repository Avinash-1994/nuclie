import crypto from 'crypto';
import { log } from '../utils/logger.js';
import { BuildConfig } from '../config/index.js';
import { getFetch } from '../utils/fetch.js';
import http from 'http';

function normalizeRemoteUrl(url: string): string {
  const webpackRemote = /^([A-Za-z0-9_$-]+)@(https?:\/\/.*)$/;
  const match = webpackRemote.exec(url);
  return match ? match[2] : url;
}

/**
 * Federation dev helper utilities
 * These helpers are used by the dev server to expose remoteEntry.js
 * and remoteEntry.json endpoints without leaking implementation details.
 */
export function createFederationDevManifest(federation: NonNullable<BuildConfig['federation']>) {
  const manifest: any = {
    name: federation.name,
    exposes: {},
    remotes: federation.remotes || {},
    shared: federation.shared || {},
    health: federation.healthCheck,
    manifestHash: ''
  };

  if (federation.exposes) {
    for (const [key, importPath] of Object.entries(federation.exposes)) {
      manifest.exposes[key] = { import: importPath };
    }
  }

  manifest.manifestHash = crypto.createHash('sha256')
    .update(JSON.stringify(manifest))
    .digest('hex');

  return manifest;
}

export function createFederationDevRemoteEntry(federation: NonNullable<BuildConfig['federation']>) {
  const exposeEntries = Object.entries(federation.exposes || {}).map(([key, importPath]) => {
    return `      ${JSON.stringify(key)}: ${JSON.stringify(importPath)}`;
  }).join(',\n');

  const sharedInitCode = federation.shared ? `
      if (sharedScope && typeof globalThis.__sparx_shared__ !== 'undefined') {
        Object.keys(sharedScope).forEach(function(name) {
          if (!globalThis.__sparx_shared__.has(name)) {
            Object.keys(sharedScope[name] || {}).forEach(function(version) {
              globalThis.__sparx_shared__.register(name, version, sharedScope[name][version].get, false);
            });
          }
        });
      }
    ` : '';

  return `// Sparx Module Federation Remote Entry (dev)
(function() {
  var remoteName = ${JSON.stringify(federation.name)};
  var exposedModules = {
${exposeEntries}
  };

  function resolvePath(moduleName) {
    var modulePath = exposedModules[moduleName];
    if (!modulePath) {
      throw new Error('[Sparx MF] Module not found: ' + moduleName);
    }
    var base = typeof import.meta !== 'undefined' ? import.meta.url : window.location.href;
    return new URL(modulePath, base).toString();
  }

  var container = {
    name: remoteName,
    init: function(sharedScope) {
      ${sharedInitCode}
      return Promise.resolve();
    },
    get: function(moduleName) {
      return Promise.resolve().then(function() {
        return import(resolvePath(moduleName));
      });
    }
  };

  globalThis['sparx_remote_' + remoteName] = container;
  globalThis[remoteName] = container;
  var event = new CustomEvent('sparx:remote:ready', { detail: { name: remoteName } });
  if (typeof document !== 'undefined') {
    document.dispatchEvent(event);
  }
})();`;
}

export class FederationDev {
    private remotes: Record<string, string> = {};
    private pollInterval: NodeJS.Timeout | null = null;
    private remoteHashes: Record<string, string> = {};

    constructor(private config: BuildConfig, private broadcast: (msg: string) => void) {
        this.remotes = config.federation?.remotes || {};
    }

    start() {
        if (Object.keys(this.remotes).length === 0) return;

        log.info('Starting Hot Federation watcher...', { category: 'hmr' });
        // Poll remotes for changes
        this.pollInterval = setInterval(() => this.checkRemotes(), 2000);
    }

    stop() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    private normalizeRemoteManifestUrl(url: string) {
      const normalizedUrl = normalizeRemoteUrl(url);
      if (normalizedUrl.endsWith('.json')) return normalizedUrl;
      if (normalizedUrl.endsWith('.js')) return normalizedUrl.replace(/\.js$/, '.json');
      return `${normalizedUrl.replace(/\/$/, '')}/remoteEntry.json`;
    }

    private async checkRemotes() {
        for (const [name, url] of Object.entries(this.remotes)) {
            try {
                const manifestUrl = this.normalizeRemoteManifestUrl(url);
                // Add timestamp to avoid caching the manifest itself
                const fetch = await getFetch();
                const resp = await fetch(`${manifestUrl}?t=${Date.now()}`);
                if (!resp.ok) continue;

                const manifest = await resp.json();
                const newHash = manifest.manifestHash;

                if (this.remoteHashes[name] && this.remoteHashes[name] !== newHash) {
                    log.info(`Remote ${name} changed, triggering update`, { category: 'hmr' });
                    this.broadcast(JSON.stringify({ type: 'federation-update', remote: name }));
                }
                this.remoteHashes[name] = newHash;
            } catch (e) {
                // Ignore errors during polling (remote might be down)
            }
        }
    }

    handleRequest(req: http.IncomingMessage, res: http.ServerResponse): boolean {
        // Mock Mode Endpoint
        // Client requests /__mock/remoteName/ModuleName
        if (this.config.federation?.mock && req.url?.startsWith('/__mock/')) {
            const parts = req.url.split('/');
            // /__mock/remote1/Button -> ["", "__mock", "remote1", "Button"]
            if (parts.length >= 4) {
                const componentName = parts[3];
                log.info(`Serving mock for ${componentName}`, { category: 'server' });

                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                // Return a simple React component stub
                // We assume React is available globally or imported
                // For a generic stub, we can try to be framework agnostic or assume React
                res.end(`
                    import React from 'react';
                    export default function Mock${componentName}(props) {
                        return React.createElement('div', { 
                            style: { border: '2px dashed #ff00ff', padding: '10px', color: '#ff00ff' } 
                        }, 'Mock: ${componentName}');
                    }
                `);
                return true;
            }
        }
        return false;
    }
}
