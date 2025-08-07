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
function WebPlatform_DOM_Inject_Script(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}

// src/lib/server/constants.ts
var SERVER_HOST = "127.0.0.1:8000";

// src/@dev--io.itch; add favorite,hide buttons.user.ts
(async () => {
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/io.itch; add favorite,hide buttons.user.js`).then((response) => response.text()));
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/lib/server/hotrefresh.iife.js`).then((response) => response.text()));
})();
