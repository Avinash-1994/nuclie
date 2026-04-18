/**
 * @sparx/rollup-compat - Plugin Compatibility Layer
 * 
 * This module provides adapters to use Rollup/Vite plugins within Sparx.
 */

export { rollupAdapter, rollupAdapter as vitePluginAdapter, rollupAdapter as viteToSparx, rollupAdapter as createRollupAdapter } from './rollup.js';
export {
    sparxBabel,
    sparxTerser,
    sparxJson,
    sparxYaml,
    sparxMdx,
    sparxSvgr,
    TierA
} from './tier-a.js';

export { webpackLoaderAdapter } from './webpack.js';
export * from './tier-b.js'; // sparxCopy, sparxHtml
export * from './tier-c.js'; // sparxReact, sparxVue, sparxSvelte
export * from './deferred.js'; // sparxCompress, sparxCssExtract
