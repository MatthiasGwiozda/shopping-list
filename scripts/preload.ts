// All of the Node.js APIs are available in the preload process.
import { injectMenuElements } from "./menu"

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  injectMenuElements()
})
