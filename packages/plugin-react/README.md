# @nuclie/plugin-react

> Official Nuclie plugin for React — JSX transform, React Fast Refresh HMR, and error overlay.

## Install

```bash
npm install --save-dev @nuclie/plugin-react
```

## Usage

```js
// nuclie.config.js
const react = require('@nuclie/plugin-react');

module.exports = {
  entry: ['./src/main.tsx'],
  plugins: [
    react(),
  ],
};
```

```ts
// nuclie.config.ts
import { defineConfig } from 'nuclie';
import react from '@nuclie/plugin-react';

export default defineConfig({
  entry: ['./src/main.tsx'],
  plugins: [react()],
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fastRefresh` | `boolean` | `true` | Enable React Fast Refresh HMR |
| `runtime` | `'automatic' \| 'classic'` | `'automatic'` | JSX runtime mode |
| `overlay` | `boolean` | `true` | Show error overlay on runtime errors |

## How It Works

- **JSX Transform**: SWC handles JSX transpilation natively. This plugin configures the `react-jsx` transform so you don't need `import React from 'react'` in every file.
- **Fast Refresh**: Injects the React Refresh runtime in dev mode. Component state is preserved across saves.
- **Error Overlay**: When a runtime error occurs, a full-screen overlay shows the stack trace with a link to open the source directly in your editor.

## Testing

```bash
cd packages/plugin-react
node --test src/__tests__/index.test.js
```

## License

MIT © Avinash-1994
