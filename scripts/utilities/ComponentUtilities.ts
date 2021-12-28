import Component from "../../components/Component";
import ComponentClasses from "../../types/components/componentClasses";
import { ComponentParameters, Components } from "../../types/components/Components";
import constants from "../constants";
import FileUtilities from "./FileUtilities";
import PathUtilities from "./PathUtilities";

enum FileType {
    script = 'scripts.js',
    html = 'index.html'
}

export default abstract class ComponentUtilities {
    /**
     * All components have a fixed structure. Through this function one can access
     * the Files, which are included in a component.
     */
    private static getComponentFilePath(component: Components, fileType: FileType) {
        const folder = fileType == FileType.script ? 'lib/' : ''
        return `${folder}${constants.componentsFolderName}/${component}/${fileType}`;
    }

    /**
     * This function injects the scripts.ts - file of the component, which is currently active.
     * Note that the script will not be "unloaded", when the component is removed from the dom.
     */
    private static injectComponentScript<T extends Component>(component: Components, htmlElement: HTMLElement, componentParameter): T {
        const scriptPath = PathUtilities.getPath(this.getComponentFilePath(component, FileType.script));
        const componentClass: new (container: HTMLElement, componentParameter: any) => T = require(scriptPath).default;
        return new componentClass(htmlElement, componentParameter);
    }

    private static injectHtmlToElement(component: Components, htmlElement: HTMLElement) {
        const html = FileUtilities.getFileContent(this.getComponentFilePath(component, FileType.html));
        const tempEl = document.createElement('div');
        tempEl.innerHTML = html;
        htmlElement.innerHTML = tempEl.innerHTML;
    }

    /**
     * In general this function allows the user to 
     * insert a component into the given htmlElement.
     * This function may for example be used in a component to inject other components.
     * @returns the instance of the component, which was defined in the components - parameter.
     */
    public static injectComponent<C extends Components>(
        component: C, htmlElement: HTMLElement, componentParameter?: ComponentParameters[C]
    ): ComponentClasses[C] {
        this.injectHtmlToElement(component, htmlElement);
        return this.injectComponentScript(component, htmlElement, componentParameter);
    }
}
