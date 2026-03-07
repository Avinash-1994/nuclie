/**
 * Plugin Authoring Guide for Nuclie v1
 * 
 * follow strict strict rules to ensure stability and compatibility.
 */

/*
# Nuclie Plugin API Reference

Nuclie plugins are compatible with Rollup plugins, with additional governance for stability.

## Required Properties

- `name` (string): Unique ID (e.g. `nuclie-plugin-my-feature`)
- `stability` (string): 'experimental' | 'stable' | 'deprecated'

## Hooks

All standard Rollup hooks are supported:
- `buildStart()`
- `resolveId(source, importer)`
- `load(id)`
- `transform(code, id)`
- `buildEnd()`

## Example

```typescript
import { Plugin } from 'nuclie';

export function myPlugin(): Plugin {
  return {
    name: 'nuclie-plugin-example',
    stability: 'stable',
    async transform(code, id) {
      if (id.endsWith('.foo')) {
        return code.replace('foo', 'bar');
      }
    }
  };
}
```
*/
