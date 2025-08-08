// ==UserScript==
// @name        @dev--io.itch; add favorite,hide buttons
// @match       *://itch.io/*
// @version     1.0.0
// @description 5/5/2024, 7:21:16 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase/browseruserscripts
// ==/UserScript==

// src/lib/ericchase/WebPlatform_DOM_Inject_Script.ts
function WebPlatform_DOM_Inject_Script(code, setup_fn) {
  const script = document.createElement("script");
  setup_fn?.(script);
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}

// src/lib/ericchase/WebPlatform_DOM_ReadyState_Callback.ts
async function Async_WebPlatform_DOM_ReadyState_Callback(config) {
  async function DOMContentLoaded() {
    removeEventListener("DOMContentLoaded", DOMContentLoaded);
    await config.DOMContentLoaded?.();
  }
  async function load() {
    removeEventListener("load", load);
    await config.load?.();
  }
  switch (document.readyState) {
    case "loading":
      if (config.DOMContentLoaded !== undefined) {
        addEventListener("DOMContentLoaded", DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "interactive":
      await config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "complete":
      await config.DOMContentLoaded?.();
      await config.load?.();
      break;
  }
}

// src/lib/server/constants.ts
var SERVER_HOST = "127.0.0.1:8000";

// src/@dev--io.itch; add favorite,hide buttons.user.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/io.itch; add favorite,hide buttons.user.js`).then((response) => response.text()));
    WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/lib/server/hotrefresh.iife.js`).then((response) => response.text()));
  }
});
