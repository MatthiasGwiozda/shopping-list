import Items from "../../../../components/items/scripts";
import ComponentFactory from "../interfaces/ComponentFactory";

export default class ItemsFactory implements ComponentFactory {

    getComponent(container: HTMLElement): Items {
        return new Items(container);
    }
}
