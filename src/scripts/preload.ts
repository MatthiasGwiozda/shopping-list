// All of the Node.js APIs are available in the preload process.
import { ipcRenderer } from 'electron';
import constants from "./constants";
import InstanceContainer from "./instances/InstanceContainer";

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {
  const instanceContainer = new InstanceContainer();
  await instanceContainer.createInstances();
  await instanceContainer.databaseInstanciator.createDatabaseIfNotExistent();
  const menu = instanceContainer.getMenu();
  menu.addMenuToDocument();
})

/**
 * The contextmenu - event triggers when the user
 * rightclicks something on the website.
 * The event is sent to the main process in the main.ts - file.
 */
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send(constants.ipcMessages.showContextMenu);
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
