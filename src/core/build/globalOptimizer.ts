
import { Transformer } from '../transform/transformer.js';
import { BuildArtifact } from '../engine/types.js';
import { explainReporter } from '../engine/events.js';

export class GlobalOptimizer {
    /**
     * Aggressively optimize artifacts by performing a global native minification pass.
     * This allows cross-module deduplication and better mangling.
     */
    async optimize(artifacts: BuildArtifact[]) {
        explainReporter.report('optimize', 'start', 'Starting Global Native Optimization');

        for (const artifact of artifacts) {
            if (artifact.type === 'js' && typeof artifact.source === 'string') {
                const originalSize = artifact.source.length;

                // Native Global Minification Pass
                artifact.source = Transformer.minifySync(artifact.source);

                const optimizedSize = (artifact.source as string).length;
                const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

                explainReporter.report('optimize', 'complete',
                    `Optimized ${artifact.fileName}: ${originalSize} -> ${optimizedSize} bytes (${savings}% savings)`);
            }
        }
    }
}
