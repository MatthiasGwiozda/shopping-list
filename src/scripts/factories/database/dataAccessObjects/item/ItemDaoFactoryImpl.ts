import ItemDaoImpl from "../../../../database/dataAccessObjects/item/ItemDaoImpl";
import QueryExecutor from "../../../../database/queryExecutor/QueryExecutor";
import ItemDaoFactory from "./ItemDaoFactory";

export default class ItemDaoFactoryImpl implements ItemDaoFactory {

    constructor(
        private queryExecutor: QueryExecutor
    ) { }

    getDao(): ItemDaoImpl {
        return new ItemDaoImpl(this.queryExecutor);
    }
}
