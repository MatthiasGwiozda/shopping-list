import constants from "../constants";

const { ipcRenderer } = require('electron')

/**
 * Provides functionality for alerts, confirms, etc.
 * @remark electron doesn't really support functions, like
 * alert and confirm. When using them, input fields cannot be
 * focused anymore. Thats why this Utilities were created.
 * With the electron internal dialog - package this bugs are
 * not a problem anymore.
 */
export default abstract class DialogUtilities {
    static alert(message: string) {
        ipcRenderer.sendSync(constants.ipcMessages.alert, message);
    }

    static confirm(message: string): boolean {
        return ipcRenderer.sendSync(constants.ipcMessages.confirm, message);
    }
}
