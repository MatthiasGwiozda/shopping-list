import Shop from "../../../types/Shop";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import ShopDao from "./ShopDao";

export default class ShopDaoImpl implements ShopDao {

    constructor(
        private queryExecutor: QueryExecutor,
    ) { }

    selectAllShops(): Promise<Shop[]> {
        return this.queryExecutor.runQuery(`
        SELECT shop_name, street, house_number, postal_code, shop_id
            FROM shops;
        `);
    }
}
