import SortableCategories from "../../../../../../components/SortableCategories/scripts";
import Shop from "../../../../../types/Shop";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class SortableCategoriesAdditionalActionFactory implements AdditionalActionFactory<Shop> {

    getComponent(container: HTMLElement, shop: Shop): SortableCategories {
        return new SortableCategories(container, shop);
    }
}
