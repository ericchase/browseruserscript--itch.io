// ==UserScript==
// @name        @dev--io.itch; add favorite,hide buttons
// @match       *://itch.io/*
// @version     1.0.0
// @description 5/5/2024, 7:21:16 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase/browseruserscripts
// ==/UserScript==

import { WebPlatform_DOM_Inject_Script } from './lib/ericchase/WebPlatform_DOM_Inject_Script.js';
import { SERVER_HOST } from './lib/server/constants.js';

(async () => {
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/io.itch; add favorite,hide buttons.user.js`).then((response) => response.text()));
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/lib/server/hotrefresh.iife.js`).then((response) => response.text()));
})();
