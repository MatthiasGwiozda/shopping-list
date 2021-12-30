import constants from "../scripts/constants";
import FileUtilities from "../scripts/utilities/FileUtilities";
import PathUtilities from "../scripts/utilities/PathUtilities";
import { ComponentParameters, Components } from "../types/components/Components";

enum FileType {
    script = 'scripts.js',
    html = 'index.html'
}

/**
 * The base - class for every Component.
 * Every Component must "default export" a Class, which extends
 * this Component - class.
 * 
 * The generic part is useful so that a component knows it's parameters, which are stored
 * in the ComponentParameters.
 * 
 * The Component - class additionally takes care of the injection of a component.
 */
export default abstract class Component<C extends Components> {
    /**
     * The constructor of a class, which extends the Component - class must use the default - constructor, so
     * that this two parameters will always be provided.
     * 
     * @param container the container, in which the element was loaded.
     * Every component may be loaded more than once at the same time.
     * through this parameter the Component is able to identify the actual HTMLElement
     * for it's "instance".
     * 
     * @param componentParameters the parameters, which can be passed into a component
     */
    constructor(
        protected container: HTMLElement,
        protected componentParameters: ComponentParameters[C],
        private readonly component: Components
    ) { }
    /**
     * this function will be called once when a Component was rendered in the dom.
     */
    public abstract rendered(): void;

    /**
     * reloads the component with the parameters, which were
     * initially provided.
     */
    protected reloadComponent() {
        Component.injectComponent(this.component, this.container, this.componentParameters);
    }

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
    private static injectComponentScript<T extends Component<any>>(component: Components, htmlElement: HTMLElement, componentParameter): T {
        const scriptPath = PathUtilities.getPath(this.getComponentFilePath(component, FileType.script));
        /**
         * the type is a reference to the constructor of the Components - class.
         */
        const componentClass: new (container: HTMLElement, componentParameter: any, component: Components) => T = require(scriptPath).default;
        return new componentClass(htmlElement, componentParameter, component);
    }

    private static injectHtmlToElement(component: Components, htmlElement: HTMLElement) {
        const html = FileUtilities.getFileContent(this.getComponentFilePath(component, FileType.html));
        htmlElement.innerHTML = html;
    }

    /**
     * In general this function allows the user to 
     * insert a component into the given htmlElement.
     * This function may for example be used in a component to inject other components.
     * @returns the instance of the component, which was defined in the components - parameter.
     */
    public static injectComponent<C extends Components>(
        component: C, htmlElement: HTMLElement, componentParameters?: ComponentParameters[C]
    ): Component<C> {
        this.injectHtmlToElement(component, htmlElement);
        const instance = this.injectComponentScript(component, htmlElement, componentParameters);
        instance.rendered();
        return instance;
    }
}
