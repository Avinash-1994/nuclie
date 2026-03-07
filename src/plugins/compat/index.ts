/**
 * @nuclie/rollup-compat - Plugin Compatibility Layer
 * 
 * This module provides adapters to use Rollup/Vite plugins within Nuclie.
 */

export { rollupAdapter } from './rollup.js';
export {
    nuclieBabel,
    nuclieTerser,
    nuclieJson,
    nuclieYaml,
    nuclieMdx,
    nuclieSvgr,
    TierA
} from './tier-a.js';

export { webpackLoaderAdapter } from './webpack.js';
export * from './tier-b.js'; // nuclieCopy, nuclieHtml
export * from './tier-c.js'; // nuclieReact, nuclieVue, nuclieSvelte
export * from './deferred.js'; // nuclieCompress, nuclieCssExtract
