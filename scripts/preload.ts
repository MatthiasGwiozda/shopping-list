// All of the Node.js APIs are available in the preload process.
import { injectMenuElements } from "./menu"
import injectComponentScript from "./utilities/injectComponentScript";

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  injectMenuElements();
  injectComponentScript();
})
