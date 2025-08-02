import ShoppingList, { ShoppingListDeps } from "../../../../components/shoppingList/ShoppingList";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class ShoppingListFactory implements MenuComponentFactory {

    constructor(private deps: ShoppingListDeps) { }

    getComponent(container: HTMLElement): ShoppingList {
        return new ShoppingList(container, this.deps);
    }
}
