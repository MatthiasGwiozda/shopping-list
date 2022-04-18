// All of the Node.js APIs are available in the preload process.
import Database from "./Database";
import { injectMenuElements } from "./menu"
import { ipcRenderer } from 'electron';
import constants from "./constants";

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {
  /**
   * the Database must be initialized in the preload.ts so that every component is allowed
   * to use the database - instance.
   * Previously it was positioned in the main.ts. The main.ts takes
   * care of the "browser - window". Therfore the components will not be allowed to use the database
   * when the database is initialized in the main.ts.
   */
  await Database.initializeDatabase();
  injectMenuElements();
})

/**
 * The contextmenu - event triggers when the user
 * rightclicks something on the website.
 * The event is sent to the main process in the main.ts - file.
 */
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send(constants.showContextMenuIpcMessage);
});

/**
 * In some contexts in the application a button may be
 * clicked when using a keyboard shortcut.
 * This function handles this shortcuts.
 * Note that only the first found button in the document
 * will be used when the user uses a shortcode.
 */
window.addEventListener('keyup', function (e) {
  if (e.ctrlKey && e.key == 'n') {
    const button = document.querySelector<HTMLButtonElement>('.' + constants.addNewButtonClass);
    button?.click?.();
  }
})