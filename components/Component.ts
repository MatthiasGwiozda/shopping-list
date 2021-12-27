
/**
 * The base - class for every Component.
 * Every Component must "default export" a Class, which extends
 * this Component - class.
 */
export default abstract class Component {
    /**
     * @param container the container, in which the element was loaded.
     * Every component may be loaded more than once at the same time.
     * through this parameter the Component is able to identify the actual HTMLElement
     * for it's "instance".
     */
    constructor(protected container: HTMLElement) { }
}
