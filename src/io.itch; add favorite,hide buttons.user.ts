// ==UserScript==
// @name        io.itch; add favorite,hide buttons
// @match       *://itch.io/*
// @version     1.0.0
// @description 5/5/2024, 7:21:16 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase/browseruserscripts
// ==/UserScript==

import collectionscss from './assets/collections.css' assert { type: 'text' };
import { CreateEyeOffIcon } from './assets/icon-eye-off/eye-off.js';
import { CreateHeartIcon } from './assets/icon-heart/heart.js';
import { async_addGameToCollection, async_getGameCollections, async_initCollectionsDatabase, async_removeGameFromCollection } from './database/collections.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from './lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { WebPlatform_DOM_Inject_CSS } from './lib/ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from './lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from './lib/ericchase/WebPlatform_Node_Reference_Class.js';

const processed_set = new Set<HTMLDivElement>();

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    await async_initCollectionsDatabase();
    WebPlatform_DOM_Inject_CSS(collectionscss);
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

async function processGameCell(game_cell: HTMLDivElement) {
  const game_id = game_cell.getAttribute('data-game_id') ?? undefined;
  if (game_id !== undefined) {
    const game_collection_set = await async_getGameCollections({ game_id });

    // handle favorites collection
    {
      let in_favorites = game_collection_set.has('favorites');
      const favorites_icon = CreateHeartIcon();
      if (in_favorites === true) {
        favorites_icon.classList.add('toggled');
        game_cell.classList.add('collection-favorites');
      }
      favorites_icon.addEventListener('click', async () => {
        if (in_favorites === true) {
          // remove
          in_favorites = false;
          favorites_icon.classList.remove('toggled');
          await async_removeGameFromCollection({ collection_name: 'favorites', game_id });
          game_cell.classList.remove('collection-favorites');
        } else {
          // add
          in_favorites = true;
          favorites_icon.classList.add('toggled');
          await async_addGameToCollection({ collection_name: 'favorites', game_id });
          game_cell.classList.add('collection-favorites');
        }
      });
      WebPlatform_Node_Reference_Class(game_cell.querySelector('a.title')).tryAs(HTMLAnchorElement)?.before(favorites_icon);
    }

    // handle hidden collection
    {
      let in_hidden = game_collection_set.has('hidden');
      const eye_off_icon = CreateEyeOffIcon();
      if (in_hidden === true) {
        eye_off_icon.classList.add('toggled');
        game_cell.classList.add('collection-hidden');
      }
      eye_off_icon.addEventListener('click', async () => {
        if (in_hidden === true) {
          // remove
          in_hidden = false;
          eye_off_icon.classList.remove('toggled');
          await async_removeGameFromCollection({ collection_name: 'hidden', game_id });
          game_cell.classList.remove('collection-hidden');
        } else {
          // add
          in_hidden = true;
          eye_off_icon.classList.add('toggled');
          await async_addGameToCollection({ collection_name: 'hidden', game_id });
          game_cell.classList.add('collection-hidden');
        }
      });
      WebPlatform_Node_Reference_Class(game_cell.querySelector('a.title')).tryAs(HTMLAnchorElement)?.before(eye_off_icon);
    }
  }
}
