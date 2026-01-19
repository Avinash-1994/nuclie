
import { Transformer } from './transformer.js';
import { BuildContext } from '../engine/types.js';
import { explainReporter } from '../engine/events.js';

export class BatchTransformer {
    private transformer: Transformer;

    constructor() {
        this.transformer = new Transformer();
    }

    /**
     * Parallel batch transformation using Native Workers (SWC)
     */
    async transformBatch(modules: { id: string, content: string }[], ctx: BuildContext) {
        explainReporter.report('transform', 'batch_start', `Transforming ${modules.length} modules`);

        // 1. Prepare items for native worker
        const items = modules.map(m => ({
            id: m.id,
            path: m.id,
            content: m.content,
            loader: 'typescript' // Or detect from extension
        }));

        // 2. Execute batch transformation
        const results = await this.transformer.batchTransform(items, ctx);

        explainReporter.report('transform', 'batch_complete', `Transformed ${results.length} modules`);

        return results;
    }
}
