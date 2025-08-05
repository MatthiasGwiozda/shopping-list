import ItemCollection, { ItemCollectionDeps } from "../../../components/itemCollection/ItemCollection";
import ItemCollectionParams from "../../../types/components/itemCollection";

export default class ItemCollectionFactory {

    constructor(private deps: ItemCollectionDeps) { }

    create(
        container: HTMLElement,
        params: ItemCollectionParams,
    ): ItemCollection {
        return new ItemCollection(
            container, params, this.deps
        )
    }
}
