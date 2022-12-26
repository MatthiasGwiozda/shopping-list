import Items from "../../../../../components/items/Items";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class ItemsFactory implements ObserverableMenuComponentFactory {

    getComponent(container: HTMLElement): Items {
        return new Items(container);
    }
}
