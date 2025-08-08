// ==UserScript==
// @name        io.itch; add favorite,hide buttons
// @match       *://itch.io/*
// @version     1.0.0
// @description 5/5/2024, 7:21:16 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase/browseruserscripts
// ==/UserScript==

import { CreateHeartIcon } from './assets/heart.js';
import { async_addGameToCollection, async_getGameCollections, async_initCollectionsDatabase, async_removeGameFromCollection } from './database/collections.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from './lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from './lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from './lib/ericchase/WebPlatform_Node_Reference_Class.js';

const processed_set = new Set<HTMLDivElement>();

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    await async_initCollectionsDatabase();
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
  },
});

async function processGameCell(element: HTMLDivElement) {
  const game_id = element.getAttribute('data-game_id') ?? undefined;
  if (game_id !== undefined) {
    const game_collection_set = await async_getGameCollections({ game_id });
    let in_favorites = game_collection_set.has('favorites');

    // handle favorites collection
    const favorites_icon = CreateHeartIcon();
    if (in_favorites === true) {
      favorites_icon.classList.add('toggled');
    }
    favorites_icon.addEventListener('click', async () => {
      if (in_favorites === true) {
        in_favorites = false;
        favorites_icon.classList.remove('toggled');
        await async_removeGameFromCollection({ collection_name: 'favorites', game_id });
      } else {
        in_favorites = true;
        favorites_icon.classList.add('toggled');
        await async_addGameToCollection({ collection_name: 'favorites', game_id });
      }
    });
    WebPlatform_Node_Reference_Class(element.querySelector('a.title')).tryAs(HTMLAnchorElement)?.before(favorites_icon);
  }
}
