import CategoryDaoImpl from "../../../../database/dataAccessObjects/category/CategoryDaoImpl";
import QueryExecutor from "../../../../database/queryExecutor/QueryExecutor";
import CategoryDaoFactory from "./CategoryDaoFactory";

export default class CategoryDaoFactoryImpl implements CategoryDaoFactory {

    constructor(
        private queryExecutor: QueryExecutor
    ) { }

    getDao(): CategoryDaoImpl {
        return new CategoryDaoImpl(this.queryExecutor);
    }
}
