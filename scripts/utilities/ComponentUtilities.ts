import constants from "../constants";
import FileUtilities from "./FileUtilities";
import PathUtilities from "./PathUtilities";

/**
 * all Components, which are available in the app
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
    private static injectComponentScript(component: Components) {
        const scriptPath = PathUtilities.getPath(this.getComponentFilePath(component, FileType.script));
        /**
         * first delete the cache for the component. When a component is loaded twice,
         * the script remains in the cache. through this function the complete script
         * will be loaded again.
         * @see https://stackoverflow.com/a/16060619/6458608
         */
        delete require.cache[require.resolve(scriptPath)];
        require(scriptPath);
    }

    private static injectHtmlToElement(component: Components, htmlElement: HTMLElement) {
        const html = FileUtilities.getFileContent(this.getComponentFilePath(component, FileType.html));
        const tempEl = document.createElement('div');
        tempEl.innerHTML = html;
        htmlElement.innerHTML = tempEl.innerHTML;
    }

    public static injectComponent(component: Components, htmlElement: HTMLElement) {
        this.injectHtmlToElement(component, htmlElement);
        this.injectComponentScript(component);
    }
}
