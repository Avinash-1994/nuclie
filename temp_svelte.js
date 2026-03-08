import '/@nuclie-deps/svelte_internal_disclose-version.js?v=1772956433392';
import '/@nuclie-deps/svelte_internal_flags_legacy.js?v=1772956433392';
App[$.FILENAME] = "src/App.svelte";
import * as $ from '/@nuclie-deps/svelte_internal_client.js?v=1772956433392';
import './index.css?import';
var root = $.add_locations($.from_html(`<div class="app-container"><header class="hero"><span class="badge">v1.0.0 Stable</span> <h1>Nuclie</h1> <p class="subtitle">The high-performance build engine for modern web applications.<br/> Engineered for speed. Built for stability.</p></header> <main class="features"><div class="feature-card"><h3>Native Core</h3> <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p></div> <div class="feature-card"><h3>Sub-100ms HMR</h3> <p>Instant feedback loop with state preservation across all major frameworks.</p></div> <div class="feature-card"><h3>10k Module Scale</h3> <p>Architected to handle massive module graphs without linear performance degradation.</p></div></main> <div class="code-area"><span style="color: #6366F1">$</span> nuclie build --optimize <br/> <span style="color: #94A3B8; opacity: 0.6">// Generating optimized production bundle...</span> <br/> <span style="color: #10B981">\u2713 Build complete in 1.4s</span></div> <footer class="footer">Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a></footer></div>`), App[$.FILENAME], [
  [
    5,
    0,
    [
      [6, 2, [[7, 4], [8, 4], [9, 4, [[10, 68]]]]],
      [
        15,
        2,
        [
          [16, 4, [[17, 6], [18, 6]]],
          [20, 4, [[21, 6], [22, 6]]],
          [24, 4, [[25, 6], [26, 6]]]
        ]
      ],
      [30, 2, [[31, 4], [32, 4], [33, 4], [34, 4], [35, 4]]],
      [38, 2, [[39, 15]]]
    ]
  ]
]);
function App($$anchor, $$props) {
  $.check_target(new.target);
  $.push($$props, false, App);
  var $$exports = { ...$.legacy_api() };
  var div = root();
  $.append($$anchor, div);
  return $.pop($$exports);
}
import { createHotContext } from "/@nuclie/client";
if (!import.meta.hot) {
  import.meta.hot = createHotContext("C:/Users/Hi/Desktop/urja/urja/test-svelte-ts/src/App.svelte");
}
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (!newModule) return;
    const instances = window.__NUCLIE_SVELTE_INSTANCES__ || (window.__NUCLIE_SVELTE_INSTANCES__ = /* @__PURE__ */ new Map());
    const componentInstances = instances.get("62e7efc8ab7e714e") || [];
    componentInstances.forEach((instance) => {
      if (instance && instance.$set) {
        const state = instance.$capture_state ? instance.$capture_state() : {};
        instance.$destroy();
        const NewComponent = newModule.default;
        const newInstance = new NewComponent({
          target: instance.$$.root,
          props: instance.$$.props
        });
        if (newInstance.$inject_state && Object.keys(state).length > 0) {
          newInstance.$inject_state(state);
        }
      }
    });
  });
}
export {
  App as default
};
