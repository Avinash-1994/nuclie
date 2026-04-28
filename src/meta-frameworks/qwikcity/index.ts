import * as path from 'path';

export class QwikCityAdapter {
  constructor(private rootPath: string) {}

  /**
   * Emulates Qwik Optimizer
   */
  async optimizeNode(code: string, id: string) {
    // Splits code into QRLs (Qwik URL)
    return {
      code: code.replace(/component\$\(/g, '/* qrl */ component$('),
      qrls: ['/q-123.js', '/q-456.js']
    };
  }

  /**
   * Generates Qwikloader script for resumability
   */
  generateQwikloader() {
    return `<script>window.qwikevents=[];window.addEventListener('click',e=>window.qwikevents.push(e));</script>`;
  }

  /**
   * Renders the SSR shell with serialized state
   */
  renderSSR() {
    return `
      <!DOCTYPE html>
      <html q:container="paused">
        <head>
          ${this.generateQwikloader()}
        </head>
        <body>
          <div q:id="1" on:click="/q-123.js#click">Qwik City Store</div>
          <script type="qwik/json">{"ctx":{"1":{"count":10}}}</script>
        </body>
      </html>
    `;
  }

  createPlugin() {
    return {
      name: 'sparx-qwikcity-adapter',
      transform: async (code: string, id: string) => {
        if (id.endsWith('.tsx')) {
          const opt = await this.optimizeNode(code, id);
          return opt.code;
        }
        return null;
      }
    };
  }
}
