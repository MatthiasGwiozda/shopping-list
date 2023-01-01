import CategoryDaoImpl from "../../../database/dataAccessObjects/category/CategoryDaoImpl";
import ItemDaoImpl from "../../../database/dataAccessObjects/item/ItemDaoImpl";
import ShopDaoImpl from "../../../database/dataAccessObjects/shop/ShopDaoImpl";
import QueryExecutor from "../../../database/queryExecutor/QueryExecutor";
import ComponentReadyChecks from "../../../menu/types/readyCheck/ComponentReadyChecks";
import ComponentReadyChecksImpl from "../../../menu/types/readyCheck/ComponentReadyChecksImpl";
import ComponentReadyChecksFactory from "./ComponentReadyChecksFactory";

export default class ComponentReadyChecksFactoryImpl implements ComponentReadyChecksFactory {

    constructor(
        private queryExecutor: QueryExecutor
    ) { }

    getReadyChecks(): ComponentReadyChecks {
        return new ComponentReadyChecksImpl(
            new CategoryDaoImpl(this.queryExecutor),
            new ShopDaoImpl(this.queryExecutor),
            new ItemDaoImpl(this.queryExecutor)
        )
    }
}
