import { Components } from "./Components";

type ComponentConstructor<ComponentClass, Param> = new (container: HTMLElement, componentParameter: Param) => ComponentClass;

export default ComponentConstructor;