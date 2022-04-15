// Modules to control application life and create native browser window
import { app, Menu, BrowserWindow, session, shell } from 'electron';
import * as path from 'path';
import PathUtilities from './utilities/PathUtilities';
require('@electron/remote/main').initialize()

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 497,
    minWidth: 520,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    fullscreenable: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile(PathUtilities.getPath(`index.html`));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  require("@electron/remote/main").enable(mainWindow.webContents)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  /**
   * Set the CSP - header for security reasons
   */
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\'']
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * Customize the Menu:
 */
const menu = Menu.buildFromTemplate(
  [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Read the documentation',
          click: async () => {
            await shell.openExternal('https://github.com/MatthiasGwiozda/shopping-list/tree/main/documentation')
          }
        }
      ]
    }
  ]
)

Menu.setApplicationMenu(menu)