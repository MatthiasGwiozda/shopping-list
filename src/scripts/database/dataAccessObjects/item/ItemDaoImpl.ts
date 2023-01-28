import Item from "../../../types/Item";
import QueryExecutorUser from "../../queryExecutor/QueryExecutorUser";
import ItemDao from "./ItemDao";

export default class ItemDaoImpl extends QueryExecutorUser implements ItemDao {

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
