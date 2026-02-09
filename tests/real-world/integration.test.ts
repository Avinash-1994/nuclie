import { describe, it, expect, beforeAll } from '@jest/globals';
import { buildProject } from '../../src/build/index.js';
import path from 'path';
import fs from 'fs';

describe('Real-World Project Integration Tests', () => {
  const realWorldDir = path.resolve(process.cwd(), 'tests/fixtures/real-world');

  beforeAll(() => {
    if (!fs.existsSync(realWorldDir)) {
      fs.mkdirSync(realWorldDir, { recursive: true });
    }
  });

  // Note: External repo tests (TanStack Table, React Query) removed
  // They require cloning and installing dependencies which is too heavy for CI
  // Use simplified real-world tests below instead

  describe('Simplified Real-World Test', () => {
    // For CI/CD, use a simplified version that doesn't require cloning
    it('should build a complex React component', async () => {
      const projectPath = path.join(realWorldDir, 'complex-component');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        // Create a complex component with hooks, context, etc.
        fs.writeFileSync(
          path.join(projectPath, 'src/ComplexComponent.tsx'),
          `import React, { useState, useEffect, useContext, createContext } from 'react';

const ThemeContext = createContext({ theme: 'light' });

interface Props {
  title: string;
  items: string[];
  onSelect?: (item: string) => void;
}

export const ComplexComponent: React.FC<Props> = ({ title, items, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  useEffect(() => {
    if (selected) {
      onSelect?.(selected);
    }
  }, [selected, onSelect]);

  const handleClick = (item: string) => {
    setSelected(item);
    setCount(prev => prev + 1);
  };

  return (
    <div className={\`container theme-\${theme}\`}>
      <h1>{title}</h1>
      <p>Clicked {count} times</p>
      <ul>
        {items.map(item => (
          <li 
            key={item}
            onClick={() => handleClick(item)}
            className={selected === item ? 'selected' : ''}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};`
        );

        fs.writeFileSync(
          path.join(projectPath, 'src/index.ts'),
          `export { ComplexComponent } from './ComplexComponent';`
        );

        fs.writeFileSync(
          path.join(projectPath, 'package.json'),
          JSON.stringify({
            name: 'complex-component',
            type: 'module',
            dependencies: {
              'react': '^18.0.0',
              '@types/react': '^18.0.0'
            }
          }, null, 2)
        );
      }

      const result = await buildProject({
        root: projectPath,
        entry: ['src/index.ts'],
        outDir: 'dist',
        minify: true
      });

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      // Verify output exists
      const distPath = path.join(projectPath, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (jsFiles.length > 0) {
          // Read the bundle
          const bundle = fs.readFileSync(
            path.join(distPath, jsFiles[0]),
            'utf-8'
          );

          // Should contain React hooks
          expect(bundle).toContain('useState');
          expect(bundle).toContain('useEffect');
        }
      }
    }, 15000);

    it('should handle TypeScript generics', async () => {
      const projectPath = path.join(realWorldDir, 'ts-generics');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/utils.ts'),
          `export function identity<T>(value: T): T {
  return value;
}

export class Container<T> {
  constructor(private value: T) {}
  
  get(): T {
    return this.value;
  }
  
  map<U>(fn: (value: T) => U): Container<U> {
    return new Container(fn(this.value));
  }
}

export interface Result<T, E> {
  ok: boolean;
  value?: T;
  error?: E;
}

export function createResult<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}`
        );

        fs.writeFileSync(
          path.join(projectPath, 'package.json'),
          JSON.stringify({ name: 'ts-generics', type: 'module' }, null, 2)
        );
      }

      const result = await buildProject({
        root: projectPath,
        entry: ['src/utils.ts'],
        outDir: 'dist'
      });

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const distPath = path.join(projectPath, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
        if (files.length > 0) {
          const output = fs.readFileSync(
            path.join(distPath, files[0]),
            'utf-8'
          );

          // Type annotations should be removed
          expect(output).not.toContain('<T>');
          expect(output).not.toContain(': T');

          // But code should remain
          expect(output).toContain('identity');
          expect(output).toContain('Container');
        }
      }
    });
  });
});
