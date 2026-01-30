/**
 * Build API - Public interface for running production builds
 * Wraps the CoreBuildEngine for easier testing and programmatic use
 */

import { CoreBuildEngine } from '../core/engine/index.js';
import { BuildConfig, BuildMode as ConfigBuildMode } from '../config/index.js';
import { BuildMode as EngineBuildMode } from '../core/engine/types.js';
import path from 'path';

export interface BuildProjectOptions {
    root: string;
    entry: string[];
    outDir: string;
    minify?: boolean;
    sourcemap?: boolean;
    mode?: ConfigBuildMode;
}

export interface BuildResult {
    success: boolean;
    errors: Array<{ message: string; code?: string }>;
    warnings: Array<{ message: string }>;
    artifacts?: any[];
    duration?: number;
    fingerprint?: any; // BuildFingerprint object
}

/**
 * Build a project programmatically
 * @public
 */
export async function buildProject(options: BuildProjectOptions): Promise<BuildResult> {
    const startTime = performance.now();

    try {
        const configMode = options.mode || 'production';
        const engineMode: EngineBuildMode = configMode === 'production' ? 'production' :
            configMode === 'test' ? 'ci' : 'dev';

        const config: BuildConfig = {
            root: options.root,
            entry: options.entry,
            outDir: options.outDir,
            mode: configMode,
            platform: 'browser',
            preset: 'spa',
            build: {
                minify: options.minify ?? true,
                sourcemap: options.sourcemap ? 'external' : 'none'
            },
            port: 5173,
            plugins: []
        };

        const engine = new CoreBuildEngine();
        const result = await engine.run(
            config,
            engineMode,
            options.root
        );

        await engine.close();

        const duration = performance.now() - startTime;

        if (result.success) {
            return {
                success: true,
                errors: [],
                warnings: [],
                artifacts: result.artifacts,
                duration,
                fingerprint: result.fingerprint
            };
        } else {
            return {
                success: false,
                errors: [result.error || { message: 'Build failed' }],
                warnings: [],
                duration
            };
        }
    } catch (error: any) {
        const duration = performance.now() - startTime;
        return {
            success: false,
            errors: [{ message: error.message, code: error.code }],
            warnings: [],
            duration
        };
    }
}

/**
 * Build multiple projects in parallel
 * @public
 */
export async function buildProjects(
    projects: BuildProjectOptions[]
): Promise<BuildResult[]> {
    return Promise.all(projects.map(project => buildProject(project)));
}
