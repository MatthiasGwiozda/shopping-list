import Category from "../../../types/Category";
import QueryExecutorDao from "../QueryExecutorDao";
import CategoryDao from "./CategoryDao";

export default class CategoryDaoImpl extends QueryExecutorDao implements CategoryDao {

    selectAllCategories(): Promise<Category[]> {
        return this.queryExecutor.runQuery(`
        SELECT *
            FROM goods_categories;
        `)
    }
}
