import SortableCategories, { SortableCategoriesDeps } from "../../../../../components/sortableCategories/SortableCategories";
import Shop from "../../../../../types/Shop";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class SortableCategoriesAdditionalActionFactory implements AdditionalActionFactory<Shop> {

    constructor(private deps: SortableCategoriesDeps) { }

    getComponent(container: HTMLElement, shop: Shop): SortableCategories {
        return new SortableCategories(container, shop, this.deps);
    }
}
