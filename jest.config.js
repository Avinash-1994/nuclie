export default {
    preset: 'ts-jest/presets/default-esm', // Use ESM preset
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts', '.mts'],
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/src/**/*.test.ts'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/tests/e2e/',
        '/tests/fixtures/',  // Ignore all fixture test files
        '/tests/visual/',  // Visual tests use Playwright, not Jest
        '/tests/module7_.*\\.test\\.ts$'  // These use custom Nexxo test API, not Jest
    ],
    roots: ['<rootDir>/tests', '<rootDir>/src'], // Run tests in both directories
    transform: {
        '^.+\\.m?[tj]sx?$': ['ts-jest', {
            useESM: true,
            isolatedModules: true,
            tsconfig: {
                module: 'esnext',
                target: 'es2020',
                esModuleInterop: true,
                moduleResolution: 'bundler'
            }
        }],
    },
    moduleNameMapper: {
        '^(\\.\\.?/.*)\\.js$': '$1',  // Fixed: matches ./ and ../ imports
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/cli/**',
    ],
};
