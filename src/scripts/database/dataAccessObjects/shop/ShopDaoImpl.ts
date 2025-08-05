import Shop from "../../../types/Shop";
import QueryExecutor from "../../queryExecutor/QueryExecutor";
import ShopDao from "./ShopDao";

interface Deps {
    queryExecutor: QueryExecutor;
}

export default class ShopDaoImpl implements ShopDao {

    constructor(private deps: Deps) { }

    selectAllShops(): Promise<Shop[]> {
        return this.deps.queryExecutor.runQuery(`
        SELECT shop_name, street, house_number, postal_code, shop_id
            FROM shops;
        `);
    }
}
