import constants from "../constants";
import PathUtilities from "./PathUtilities";

/**
 * This file injects the scripts.ts - file of the component, which is currently active.
 * This functionality is active automatically when this file is included on a page.
 */
export default function injectComponentScript() {
    const componentName = /components\/(?<componentName>.+(?=\/))/.exec(location.href)?.groups?.componentName;
    if (componentName != null) {
        /**
         * there was a component found in this path.
         * lets insert the skript for this component now.
         */
        const scriptPath = PathUtilities.getPath(`lib/${constants.componentsFolderName}/${componentName}/scripts.js`);
        require(scriptPath);
    }
}
