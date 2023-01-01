
import CategoryDao from "../../../database/dataAccessObjects/category/CategoryDao";
import ItemDao from "../../../database/dataAccessObjects/item/ItemDao";
import ShopDao from "../../../database/dataAccessObjects/shop/ShopDao";
import Item from "../../../types/Item";
import ComponentReadyChecks from "./ComponentReadyChecks";

export default class ComponentReadyChecksImpl implements ComponentReadyChecks {

    constructor(
        private categoryDao: CategoryDao,
        private shopDao: ShopDao,
        private itemDao: ItemDao
    ) { }

    async categories(): Promise<boolean> {
        const categories = await this.categoryDao.selectAllCategories()
        return this.hasAtLeastOneElement(categories);
    }

    async shops(): Promise<boolean> {
        const shops = await this.shopDao.selectAllShops();
        return this.hasAtLeastOneElement(shops);
    }

    async items(): Promise<boolean> {
        const items = await this.selectAllItems();
        return this.hasAtLeastOneElement(items);
    }

    async itemsWithFood(): Promise<boolean> {
        const foodItems = await this.selectAllFoodItems();
        return this.hasAtLeastOneElement(foodItems);
    }

    private hasAtLeastOneElement(arr: any[]): boolean {
        return arr.length > 0;
    }

    private selectAllItems(): Promise<Item[]> {
        return this.itemDao.selectAllItems();
    }

    private async selectAllFoodItems(): Promise<Item[]> {
        const items = await this.selectAllItems();
        return items.filter(item => item.food);
    }
}
