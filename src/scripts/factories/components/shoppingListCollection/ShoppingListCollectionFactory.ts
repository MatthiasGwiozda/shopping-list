import ShoppingListCollection, { ShoppingListCollectionDeps } from "../../../components/shoppingListCollection/ShoppingListCollection";

export default class ShoppingListCollectionFactory {

    constructor(private deps: ShoppingListCollectionDeps) { }

    create(container: HTMLElement): ShoppingListCollection {
        return new ShoppingListCollection(container, this.deps);
    }
}
