import constants from "../constants";
import PathUtilities from "./PathUtilities";

export default abstract class ComponentUtilities {
    /**
     * @returns the current component. The component is extracted from the location - object.
     */
    static getCurrentActiveComponent() {
        return /components\/(?<componentName>.+(?=\/))/.exec(location.href)?.groups?.componentName;
    }
    /**
     * This function injects the scripts.ts - file of the component, which is currently active.
     */
    static injectComponentScript() {
        const componentName = this.getCurrentActiveComponent();
        if (componentName != null) {
            /**
             * there was a component found in this path.
             * lets insert the skript for this component now.
             */
            const scriptPath = PathUtilities.getPath(`lib/${constants.componentsFolderName}/${componentName}/scripts.js`);
            require(scriptPath);
        }
    }
}
