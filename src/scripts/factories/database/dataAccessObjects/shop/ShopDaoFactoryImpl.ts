import ShopDaoImpl from "../../../../database/dataAccessObjects/shop/ShopDaoImpl";
import QueryExecutor from "../../../../database/queryExecutor/QueryExecutor";
import ShopDaoFactory from "./ShopDaoFactory";

export default class ShopDaoFactoryImpl implements ShopDaoFactory {

    constructor(
        private queryExecutor: QueryExecutor
    ) { }

    getDao(): ShopDaoImpl {
        return new ShopDaoImpl(this.queryExecutor);
    }
}
