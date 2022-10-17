import { Components } from "./Components";

type ComponentConstructor<ComponentClass, Param> = new (container: HTMLElement, componentParameter: Param, component: Components) => ComponentClass;

export default ComponentConstructor;