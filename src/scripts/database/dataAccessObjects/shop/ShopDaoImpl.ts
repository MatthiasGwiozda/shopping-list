import Shop from "../../../types/Shop";
import QueryExecutorUser from "../../queryExecutor/QueryExecutorUser";
import ShopDao from "./ShopDao";

export default class ShopDaoImpl extends QueryExecutorUser implements ShopDao {

    selectAllShops(): Promise<Shop[]> {
        return this.queryExecutor.runQuery(`
        SELECT shop_name, street, house_number, postal_code, shop_id
            FROM shops;
        `);
    }
}
