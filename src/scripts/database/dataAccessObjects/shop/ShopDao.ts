import Shop from "../../../types/Shop";

export default interface ShopDao {
    selectAllShops(): Promise<Shop[]>;
}
