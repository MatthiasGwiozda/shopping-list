import CategoryDao from "../../../../database/dataAccessObjects/category/CategoryDao";
import CategoryDaoImpl from "../../../../database/dataAccessObjects/category/CategoryDaoImpl";
import QueryExecutorDaoFactory from "../QueryExecutorDaoFactory";
import CategoryDaoFactory from "./CategoryDaoFactory";

export default class CategoryDaoQueryExecutorFactory extends QueryExecutorDaoFactory implements CategoryDaoFactory {

    async getCategoryDao(): Promise<CategoryDao> {
        return new CategoryDaoImpl(this.queryExecutor);
    }
}
