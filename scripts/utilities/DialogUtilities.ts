const { dialog } = require('@electron/remote');

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
        dialog.showMessageBoxSync({
            message
        })
    }

    static confirm(message: string): boolean {
        const buttonIndex = dialog.showMessageBoxSync({
            message,
            buttons: [
                'OK',
                'cancel'
            ]
        });
        /**
         * the button with the index 0 is the ok - button
         */
        return buttonIndex == 0;
    }
}
