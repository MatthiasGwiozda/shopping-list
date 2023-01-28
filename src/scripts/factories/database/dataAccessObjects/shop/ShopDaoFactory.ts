import ShopDao from "../../../../database/dataAccessObjects/shop/ShopDao";

export default interface ShopDaoFactory {
    getDao(): ShopDao;
}
