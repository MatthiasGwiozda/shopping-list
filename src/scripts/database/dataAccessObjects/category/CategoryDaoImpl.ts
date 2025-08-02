import Category from "../../../types/Category";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import CategoryDao from "./CategoryDao";

export default class CategoryDaoImpl implements CategoryDao {

    constructor(
        private queryExecutor: QueryExecutor,
    ) { }

    selectAllCategories(): Promise<Category[]> {
        return this.queryExecutor.runQuery(`
        SELECT *
            FROM goods_categories;
        `)
    }
}
