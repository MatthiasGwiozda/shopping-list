import Items from "../../../../../components/items/scripts";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class ItemsFactory implements MenuComponentFactory {

    getComponent(container: HTMLElement): Items {
        return new Items(container);
    }
}
