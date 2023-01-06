import CategoryDao from "../../../database/dataAccessObjects/category/CategoryDao";
import ItemDao from "../../../database/dataAccessObjects/item/ItemDao";
import ShopDao from "../../../database/dataAccessObjects/shop/ShopDao";
import ComponentReadyChecksImpl from "../../../menu/types/readyCheck/ComponentReadyChecksImpl";
import ComponentReadyChecksFactory from "./ComponentReadyChecksFactory";

export default class ComponentReadyChecksFactoryImpl implements ComponentReadyChecksFactory {

    constructor(
        private categoryDao: CategoryDao,
        private shopDao: ShopDao,
        private itemDao: ItemDao
    ) { }

    getReadyChecks(): ComponentReadyChecksImpl {
        return new ComponentReadyChecksImpl(
            this.categoryDao,
            this.shopDao,
            this.itemDao
        )
    }
}
