import SortableCategories from "../../../../../../components/sortableCategories/SortableCategories";
import Shop from "../../../../../types/Shop";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class SortableCategoriesAdditionalActionFactory implements AdditionalActionFactory<Shop> {

    getComponent(container: HTMLElement, shop: Shop): SortableCategories {
        return new SortableCategories(container, shop);
    }
}
