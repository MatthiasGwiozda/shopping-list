import Items, { ItemsDeps } from "../../../../components/items/Items";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class ItemsFactory implements ObserverableMenuComponentFactory {

    constructor(private deps: ItemsDeps) { }

    getComponent(container: HTMLElement): Items {
        return new Items(container, this.deps);
    }
}
