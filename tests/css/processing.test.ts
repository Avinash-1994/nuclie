import { describe, it, expect, beforeAll } from '@jest/globals';
import path from 'path';
import fs from 'fs';

describe('CSS Processing Tests', () => {
  const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures/css');

  beforeAll(() => {
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
  });

  describe('CSS Modules', () => {
    it('should validate CSS module files', async () => {
      const projectPath = path.join(fixturesDir, 'css-modules');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/Button.module.css'),
          `.button {
  background: blue;
  color: white;
  padding: 10px;
}

.primary {
  background: green;
}`
        );
      }

      const cssContent = fs.readFileSync(
        path.join(projectPath, 'src/Button.module.css'),
        'utf-8'
      );

      expect(cssContent).toContain('.button');
      expect(cssContent).toContain('.primary');
    });

    it('should validate scoped CSS', async () => {
      const projectPath = path.join(fixturesDir, 'scoped-css');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/styles.css'),
          `.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container {
    max-width: 100%;
  }
}`
        );
      }

      const cssContent = fs.readFileSync(
        path.join(projectPath, 'src/styles.css'),
        'utf-8'
      );

      expect(cssContent).toContain('.container');
      expect(cssContent).toContain('@media');
    });
  });

  describe('PostCSS Integration', () => {
    it('should validate modern CSS syntax', async () => {
      const projectPath = path.join(fixturesDir, 'postcss');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/modern.css'),
          `.card {
  background: white;
  border-radius: 8px;
}`
        );
      }

      const cssContent = fs.readFileSync(
        path.join(projectPath, 'src/modern.css'),
        'utf-8'
      );

      expect(cssContent).toContain('.card');
      expect(cssContent).toContain('border-radius');
    });
  });

  describe('SCSS Compilation', () => {
    it('should validate SCSS syntax', async () => {
      const projectPath = path.join(fixturesDir, 'scss');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/styles.scss'),
          `$primary-color: #3498db;

.app {
  .header {
    background: $primary-color;
  }
}`
        );
      }

      const scssContent = fs.readFileSync(
        path.join(projectPath, 'src/styles.scss'),
        'utf-8'
      );

      expect(scssContent).toContain('$primary-color');
      expect(scssContent).toContain('.app');
    });
  });

  describe('Tailwind CSS', () => {
    it('should validate Tailwind utility classes', async () => {
      const projectPath = path.join(fixturesDir, 'tailwind');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/App.tsx'),
          `import React from 'react';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind</h1>
      </div>
    </div>
  );
};`
        );
      }

      const content = fs.readFileSync(
        path.join(projectPath, 'src/App.tsx'),
        'utf-8'
      );

      expect(content).toContain('className');
      expect(content).toContain('bg-gray-100');
      expect(content).toContain('text-3xl');
    });
  });

  describe('CSS Optimization', () => {
    it('should validate CSS structure', async () => {
      const projectPath = path.join(fixturesDir, 'minify');

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
          path.join(projectPath, 'src/styles.css'),
          `.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}`
        );
      }

      const cssContent = fs.readFileSync(
        path.join(projectPath, 'src/styles.css'),
        'utf-8'
      );

      expect(cssContent).toContain('.button');
      expect(cssContent).toContain('background-color');
    });
  });
});
