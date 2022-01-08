import { Components } from "./Components";

type ComponentConstructor<T> = new (container: HTMLElement, componentParameter: any, component: Components) => T;

export default ComponentConstructor;