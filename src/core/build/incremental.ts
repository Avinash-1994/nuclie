
import { DependencyGraph } from '../../resolve/graph.js';
import { BuildContext } from '../engine/types.js';

export class IncrementalBuild {
    /**
     * Finds all modules that need to be re-transformed based on changed files.
     * Performs a reverse dependency walk if necessary (e.g., for HMR or cross-module optimization).
     */
    findDirtyModules(changedFiles: string[], graph: DependencyGraph): string[] {
        const dirty = new Set<string>();

        for (const file of changedFiles) {
            // Find module in graph
            // (In a real implementation, we'd map file path to module ID)
            for (const [id, node] of graph.nodes.entries()) {
                if (node.path === file || id === file) {
                    dirty.add(id);
                }
            }
        }

        return Array.from(dirty);
    }

    /**
     * Efficiently updates the build state with only changed modules
     */
    async rebuild(ctx: BuildContext, changedFiles: string[]) {
        const dirtyIds = this.findDirtyModules(changedFiles, ctx.graph);
        if (dirtyIds.length === 0) return [];

        // Return dirty IDs for the engine to re-process
        return dirtyIds;
    }
}
