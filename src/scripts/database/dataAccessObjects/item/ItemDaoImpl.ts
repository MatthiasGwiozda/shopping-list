import Item from "../../../types/Item";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import ItemDao from "./ItemDao";

export default class ItemDaoImpl implements ItemDao {

    constructor(
        private queryExecutor: QueryExecutor,
    ) { }

    async selectAllItems(): Promise<Item[]> {
        const items = await this.queryExecutor.runQuery<Item>(`
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
