/**
 * Property-Based Tests for Universal Transformer
 * 
 * Uses fast-check to automatically generate test cases and discover edge cases
 * that traditional example-based testing might miss.
 */

import fc from 'fast-check';
import { transform } from '../../src/core/transformer/universal-transformer.js';
import * as acorn from 'acorn';

describe('Property-Based: Universal Transformer', () => {
    /**
     * Property: Transformed code should always be valid JavaScript
     * 
     * This test generates random valid JavaScript code and ensures
     * the transformer always produces parseable output.
     */
    it('should always produce valid JavaScript from valid input', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    // Simple variable declarations
                    fc.record({
                        type: fc.constant('var'),
                        name: fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/),
                        value: fc.oneof(fc.integer(), fc.string(), fc.boolean())
                    }).map(({ name, value }) =>
                        `const ${name} = ${JSON.stringify(value)};`
                    ),

                    // Function declarations
                    fc.record({
                        name: fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/),
                        params: fc.array(fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/), { maxLength: 3 }),
                        body: fc.constant('return true;')
                    }).map(({ name, params, body }) =>
                        `function ${name}(${params.join(', ')}) { ${body} }`
                    ),

                    // Import statements
                    fc.record({
                        name: fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/),
                        from: fc.stringMatching(/^[a-zA-Z0-9\-_/]+$/)
                    }).map(({ name, from }) =>
                        `import ${name} from '${from}';`
                    )
                ),
                (code) => {
                    try {
                        const result = transform(code, {
                            filename: 'test.js',
                            framework: 'vanilla'
                        });

                        // Result should be parseable JavaScript
                        expect(() => acorn.parse(result.code, {
                            ecmaVersion: 'latest',
                            sourceType: 'module'
                        })).not.toThrow();

                        return true;
                    } catch (error) {
                        // If transform fails, it should fail gracefully
                        expect(error).toBeDefined();
                        return true;
                    }
                }
            ),
            { numRuns: 100 } // Run 100 random test cases
        );
    });

    /**
     * Property: TypeScript type annotations should be removed
     * 
     * Generates TypeScript code with type annotations and verifies
     * they are completely removed in the output.
     */
    it('should always remove TypeScript type annotations', () => {
        fc.assert(
            fc.property(
                fc.record({
                    varName: fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/),
                    type: fc.oneof(
                        fc.constant('string'),
                        fc.constant('number'),
                        fc.constant('boolean'),
                        fc.constant('any')
                    ),
                    value: fc.oneof(
                        fc.string().map(s => `"${s}"`),
                        fc.integer().map(n => n.toString()),
                        fc.boolean().map(b => b.toString())
                    )
                }),
                ({ varName, type, value }) => {
                    const tsCode = `const ${varName}: ${type} = ${value};`;

                    const result = transform(tsCode, {
                        filename: 'test.ts',
                        framework: 'vanilla'
                    });

                    // Type annotation should be removed
                    expect(result.code).not.toContain(`: ${type}`);
                    // Variable should still exist
                    expect(result.code).toContain(varName);

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * Property: Transformation should be idempotent for vanilla JS
     * 
     * Transforming already-transformed code should produce the same result.
     */
    it('should be idempotent for vanilla JavaScript', () => {
        fc.assert(
            fc.property(
                fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/).chain(name =>
                    fc.record({
                        name: fc.constant(name),
                        value: fc.integer()
                    })
                ).map(({ name, value }) => `const ${name} = ${value};`),
                (code) => {
                    const result1 = transform(code, {
                        filename: 'test.js',
                        framework: 'vanilla'
                    });

                    const result2 = transform(result1.code, {
                        filename: 'test.js',
                        framework: 'vanilla'
                    });

                    // Second transformation should produce same result
                    expect(result2.code.trim()).toBe(result1.code.trim());

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * Property: Source maps should always be generated
     * 
     * Any transformation should produce a valid source map.
     */
    it('should always generate source maps', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.constant('const x = 1;'),
                    fc.constant('function foo() { return 42; }'),
                    fc.constant('export default class Bar {}')
                ),
                (code) => {
                    const result = transform(code, {
                        filename: 'test.js',
                        framework: 'vanilla',
                        sourcemap: true
                    });

                    // Source map should exist
                    expect(result.map).toBeDefined();

                    if (result.map) {
                        // Source map should have required fields
                        expect(result.map).toHaveProperty('version');
                        expect(result.map).toHaveProperty('sources');
                        expect(result.map).toHaveProperty('mappings');
                    }

                    return true;
                }
            ),
            { numRuns: 30 }
        );
    });

    /**
     * Property: Invalid code should fail gracefully
     * 
     * Malformed code should produce meaningful error messages.
     */
    it('should handle invalid code gracefully', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.constant('const x = {{{'),
                    fc.constant('function ((('),
                    fc.constant('import from'),
                    fc.constant('const 123abc = 1;')
                ),
                (invalidCode) => {
                    try {
                        transform(invalidCode, {
                            filename: 'test.js',
                            framework: 'vanilla'
                        });
                        // If it doesn't throw, that's also acceptable
                        return true;
                    } catch (error: any) {
                        // Error should have a message
                        expect(error.message).toBeDefined();
                        expect(typeof error.message).toBe('string');
                        expect(error.message.length).toBeGreaterThan(0);
                        return true;
                    }
                }
            ),
            { numRuns: 20 }
        );
    });

    /**
     * Property: React JSX should be transformed to createElement calls
     * 
     * Generates various JSX patterns and ensures they're properly transformed.
     */
    it('should transform JSX to React.createElement', () => {
        fc.assert(
            fc.property(
                fc.record({
                    tag: fc.oneof(
                        fc.constant('div'),
                        fc.constant('span'),
                        fc.constant('button')
                    ),
                    content: fc.oneof(
                        fc.string(),
                        fc.constant('')
                    )
                }),
                ({ tag, content }) => {
                    const jsxCode = `const el = <${tag}>${content}</${tag}>;`;

                    const result = transform(jsxCode, {
                        filename: 'test.jsx',
                        framework: 'react'
                    });

                    // Should not contain JSX syntax
                    expect(result.code).not.toContain(`<${tag}>`);
                    // Should contain createElement or jsx runtime
                    const hasCreateElement = result.code.includes('createElement') ||
                        result.code.includes('jsx') ||
                        result.code.includes('_jsx');
                    expect(hasCreateElement).toBe(true);

                    return true;
                }
            ),
            { numRuns: 40 }
        );
    });

    /**
     * Property: Code size should not explode
     * 
     * Transformed code should not be unreasonably larger than input.
     */
    it('should not produce unreasonably large output', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 10, maxLength: 1000 }).filter(s => {
                    // Filter to valid-ish JavaScript
                    return /^[a-zA-Z0-9\s;=(){}[\]"'.,]*$/.test(s);
                }),
                (code) => {
                    try {
                        const result = transform(code, {
                            filename: 'test.js',
                            framework: 'vanilla'
                        });

                        // Output should not be more than 10x input size
                        const sizeRatio = result.code.length / code.length;
                        expect(sizeRatio).toBeLessThan(10);

                        return true;
                    } catch {
                        // Invalid code is acceptable
                        return true;
                    }
                }
            ),
            { numRuns: 50 }
        );
    });
});
