import CategoryDao from "../../../../database/dataAccessObjects/category/CategoryDao";
import CategoryDaoImpl from "../../../../database/dataAccessObjects/category/CategoryDaoImpl";
import QueryExecutorUser from "../../../../database/queryExecutor/QueryExecutorUser";
import CategoryDaoFactory from "./CategoryDaoFactory";

export default class CategoryDaoFactoryImpl extends QueryExecutorUser implements CategoryDaoFactory {

    async getCategoryDao(): Promise<CategoryDao> {
        return new CategoryDaoImpl(this.queryExecutor);
    }
}
