import Component from "../../components/Component";
import constants from "../constants";
import FileUtilities from "./FileUtilities";
import PathUtilities from "./PathUtilities";

/**
 * all Components, which are available in the app.
 * they can be found in the folder "components"
 */
export enum Components {
    categories = 'categories',
    items = 'items',
    meals = 'meals',
    shoppingList = 'shoppingList',
    shops = 'shops',
    editableList = 'editableList'
}

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
    private static injectComponentScript<T extends Component>(component: Components, htmlElement: HTMLElement): T {
        const scriptPath = PathUtilities.getPath(this.getComponentFilePath(component, FileType.script));
        const componentClass: new (container: HTMLElement) => T = require(scriptPath).default;
        return new componentClass(htmlElement);
    }

    private static injectHtmlToElement(component: Components, htmlElement: HTMLElement) {
        const html = FileUtilities.getFileContent(this.getComponentFilePath(component, FileType.html));
        const tempEl = document.createElement('div');
        tempEl.innerHTML = html;
        htmlElement.innerHTML = tempEl.innerHTML;
    }

    /**
     * @returns the instance of the component, which was 
     */
    public static injectComponent<T extends Component>(component: Components, htmlElement: HTMLElement): T {
        this.injectHtmlToElement(component, htmlElement);
        return this.injectComponentScript(component, htmlElement);
    }
}
