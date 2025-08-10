import eyeoffcss from '../assets/icons/eye-off.css' assert { type: 'text' };
import eyeoffsvg from '../assets/icons/eye-off.svg' assert { type: 'text' };
import heartcss from '../assets/icons/heart.css' assert { type: 'text' };
import heartsvg from '../assets/icons/heart.svg' assert { type: 'text' };
import { WebPlatform_DOM_Inject_CSS } from './ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from './ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';

const parser = new DOMParser();

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(eyeoffcss);
    WebPlatform_DOM_Inject_CSS(heartcss);
  },
});

export function CreateEyeOffIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(eyeoffsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('eye-off-icon');
  return svg;
}

export function CreateHeartIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(heartsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('heart-icon');
  return svg;
}
