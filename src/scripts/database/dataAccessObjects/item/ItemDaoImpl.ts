import Item from "../../../types/Item";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import ItemDao from "./ItemDao";

interface Deps {
    queryExecutor: QueryExecutor;
}

export default class ItemDaoImpl implements ItemDao {

    constructor(private deps: Deps) { }

    async selectAllItems(): Promise<Item[]> {
        const items = await this.deps.queryExecutor.runQuery<Item>(`
        SELECT goods.name, goods.category, food.name IS NOT NULL AS food
            FROM goods
                LEFT JOIN food ON food.name = goods.name;
        `);
        return items.map(item => {
            /**
             * food should be a boolean in the application - context.
             */
            return { ...item, food: !!item.food }
        })
    }
}
