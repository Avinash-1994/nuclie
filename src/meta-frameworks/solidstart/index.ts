import * as path from 'path';

export class SolidStartAdapter {
  constructor(private rootPath: string) {}

  /**
   * Emulates SolidStart's renderToStream capability
   */
  renderToStream(url: string) {
    // Return a mocked Node.js ReadableStream that chunks output
    const { Readable } = require('stream');
    return new Readable({
      read() {
        this.push('<!DOCTYPE html><html><head></head><body>');
        this.push(`<div id="root">SolidStart Streaming SSR: ${url}</div>`);
        // Simulate async data suspension
        setTimeout(() => {
          this.push('<script>window._$HY={};</script></body></html>');
          this.push(null);
        }, 10);
      }
    });
  }

  /**
   * Emulates SolidStart server actions
   */
  async executeServerAction(actionId: string, payload: any) {
    if (actionId === 'loginAction') {
      return { success: true, token: 'solid-token-123' };
    }
    throw new Error('Action not found');
  }

  createPlugin() {
    return {
      name: 'sparx-solidstart-adapter',
      transform: (code: string, id: string) => {
        // Pseudo-transform for Solid's babel-plugin-jsx-dom-expressions
        if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
          return code.replace(/<([A-Z][a-zA-Z0-9]*)/g, '/* @once */ _$createComponent($1');
        }
        return null;
      }
    };
  }
}
