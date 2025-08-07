// ==UserScript==
// @name        io.itch; add favorite,hide buttons
// @match       *://itch.io/*
// @version     1.0.0
// @description 5/5/2024, 7:21:16 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase/browseruserscripts
// ==/UserScript==

import heartcss from './assets/heart.css' assert { type: 'text' };
import heartsvg from './assets/heart.svg' assert { type: 'text' };
import { Core_Utility_Debounce } from './lib/ericchase/Core_Utility_Debounce.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from './lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { WebPlatform_DOM_Inject_CSS } from './lib/ericchase/WebPlatform_DOM_Inject_CSS.js';
import { WebPlatform_Node_Reference_Class } from './lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { LocalStorageProvider } from './lib/provider/storage/local-storage-provider.js';

WebPlatform_DOM_Inject_CSS(heartcss);

const storage = new LocalStorageProvider();

const favorites_set = new Set<string>(storage.get('favorites') ?? undefined);
const parser = new DOMParser();
const processed_set = new Set<HTMLDivElement>();

const storeFavoritesSet = Core_Utility_Debounce(() => {
  storage.set('favorites', [...favorites_set]);
}, 50);

WebPlatform_DOM_Element_Added_Observer_Class({
  selector: 'div.game_cell',
}).subscribe(async (element) => {
  if (element instanceof HTMLDivElement) {
    if (processed_set.has(element) === false) {
      processed_set.add(element);
      await processGameCell(element);
    }
  }
});

async function processGameCell(element: HTMLDivElement) {
  const game_id = element.getAttribute('data-game_id') ?? undefined;
  if (game_id !== undefined) {
    const icon = createHeartIcon();
    icon.classList.add('heart-icon');
    if (favorites_set.has(game_id) === true) {
      icon.classList.add('toggled');
    }
    icon.addEventListener('click', () => {
      if (favorites_set.has(game_id) === true) {
        favorites_set.delete(game_id);
        icon.classList.remove('toggled');
      } else {
        favorites_set.add(game_id);
        icon.classList.add('toggled');
      }
      storeFavoritesSet();
    });
    WebPlatform_Node_Reference_Class(element.querySelector('a.title')).tryAs(HTMLAnchorElement)?.before(icon);
  }
}

function createHeartIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(heartsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('heart-icon');
  return svg;
}
