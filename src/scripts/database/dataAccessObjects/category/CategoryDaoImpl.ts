import Category from "../../../types/Category";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import CategoryDao from "./CategoryDao";

interface Deps {
    queryExecutor: QueryExecutor;
}

export default class CategoryDaoImpl implements CategoryDao {

    constructor(private deps: Deps) { }

    selectAllCategories(): Promise<Category[]> {
        return this.deps.queryExecutor.runQuery(`
        SELECT *
            FROM goods_categories;
        `)
    }
}
