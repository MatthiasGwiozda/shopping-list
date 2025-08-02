import Category from "../../types/Category";
import GoodsShops from "../../types/GoodsShops";
import Item from "../../types/Item";
import Shop from "../../types/Shop";

export interface CategoryAccessObject {
    selectAllCategories(): Promise<Category[]>;
    deleteCategory(categoryObject: Category): Promise<boolean>;
    insertCategory(categoryObject: Category): Promise<boolean>;
    updateCategory(oldCategory: Category, newCategory: Category): Promise<boolean>;
}

export interface ShopAccessObject {
    addShopToItem(shop: Shop, item: Item): Promise<boolean>;
    removeShopFromItem(shop: Shop, item: Item): Promise<boolean>;
    selectAllShops(): Promise<Shop[]>;
    selectGoodsShops(): Promise<GoodsShops[]>;
}

export interface ItemAccessObject {
    selectAllItems(): Promise<Item[]>;
}
