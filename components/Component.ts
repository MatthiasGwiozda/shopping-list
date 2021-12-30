import ComponentUtilities from "../scripts/utilities/ComponentUtilities";
import { ComponentParameters, Components } from "../types/components/Components";

/**
 * The base - class for every Component.
 * Every Component must "default export" a Class, which extends
 * this Component - class.
 * 
 * The generic part is useful so that a component knows it's parameters, which are stored
 * in the ComponentParameters.
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
        ComponentUtilities.injectComponent(this.component, this.container, this.componentParameters);
    }
}
