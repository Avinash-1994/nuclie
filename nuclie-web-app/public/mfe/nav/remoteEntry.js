
var navApp = (() => {
  var exposes = {
  "./Header": {
    "import": "./src/Header.jsx",
    "name": "./Header",
    "chunk": "",
    "shortId": "./src/Header.jsx"
  }
};
  var __promises = {};

  return {
    get: async (moduleName) => {
      return async () => {
        if (!exposes[moduleName]) throw new Error("Module not found: " + moduleName);
        var exposed = exposes[moduleName];
        
        // Ensure monolithic chunk is loaded
        if (exposed.chunk) {
          if (!__promises[exposed.chunk]) {
            __promises[exposed.chunk] = new Promise((resolve, reject) => {
              var script = document.createElement("script");
              /* Resolve path relative to this script */
              var scriptSrc = document.currentScript ? document.currentScript.src : window.location.href;
              var basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
              script.src = basePath + "/assets/" + exposed.chunk;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }
          await __promises[exposed.chunk];
        }
        
        // Use Nuclie's globalThis.r runtime short ID registration
        if (typeof globalThis.r === 'function') {
           return globalThis.r(exposed.shortId);
        }
        throw new Error("Nuclie runtime missing in host!");
      };
    },
    init: async (shareScope) => {
      // Dynamic federation shared scopes
      return true;
    }
  };
})();