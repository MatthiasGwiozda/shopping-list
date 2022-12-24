import ShoppingList from "../../../../components/shoppingList/scripts";
import ComponentFactory from "../interfaces/ComponentFactory";

export default class ShoppingListFactory implements ComponentFactory {

    getComponent(container: HTMLElement): ShoppingList {
        return new ShoppingList(container);
    }
}
