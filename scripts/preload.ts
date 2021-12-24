// All of the Node.js APIs are available in the preload process.
import { injectMenuElements } from "./menu"
import ComponentUtilities from "./utilities/ComponentUtilities";

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  injectMenuElements();
  ComponentUtilities.injectComponentScript();
  // a static title
  document.title = 'Grocery-list';
})
