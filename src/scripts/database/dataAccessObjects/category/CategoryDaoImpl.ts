import Category from "../../../types/Category";
import QueryExecutorUser from "../../queryExecutor/QueryExecutorUser";
import CategoryDao from "./CategoryDao";

export default class CategoryDaoImpl extends QueryExecutorUser implements CategoryDao {

    selectAllCategories(): Promise<Category[]> {
        return this.queryExecutor.runQuery(`
        SELECT *
            FROM goods_categories;
        `)
    }
}
