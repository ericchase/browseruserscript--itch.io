import collectionsmanagercss from '../assets/collections-manager.css' assert { type: 'text' };
import collectionsmanagerhtml from '../assets/collections-manager.html' assert { type: 'text' };
import { async_exportDatabase } from '../database/collections.js';
import { WebPlatform_DOM_Inject_CSS } from './ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from './ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';
import { WebPlatform_Utility_Download } from './ericchase/WebPlatform_Utility_Download.js';

const parser = new DOMParser();

export function CreateCollectionsManager() {
  const div_manager = WebPlatform_Node_Reference_Class(parser.parseFromString(collectionsmanagerhtml, 'text/html').querySelector('div')).as(HTMLDivElement);
  const button_export = WebPlatform_Node_Reference_Class(div_manager.querySelector('#export')).as(HTMLButtonElement);
  button_export.addEventListener('click', async () => {
    WebPlatform_Utility_Download({ json: await async_exportDatabase() }, 'collections_database.json');
  });
  // const button_import = WebPlatform_Node_Reference_Class(div_manager.querySelector('#import')).as(HTMLButtonElement);
  // button_import.addEventListener('click', () => {});
  return div_manager;
}

let div_manager: HTMLDivElement | undefined = undefined;

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(collectionsmanagercss);
  },
});

export function ShowCollectionsManager() {
  if (div_manager === undefined) {
    div_manager = CreateCollectionsManager();
    document.body.appendChild(div_manager);
  }
  if (div_manager !== undefined) {
    div_manager.classList.remove('hidden');
  }
}
