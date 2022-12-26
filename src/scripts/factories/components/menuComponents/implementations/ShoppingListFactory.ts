import ShoppingList from "../../../../../components/shoppingList/ShoppingList";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class ShoppingListFactory implements MenuComponentFactory {

    getComponent(container: HTMLElement): ShoppingList {
        return new ShoppingList(container);
    }
}
