
import CategoryDao from "../../database/dataAccessObjects/category/CategoryDao";
import ItemDao from "../../database/dataAccessObjects/item/ItemDao";
import ShopDao from "../../database/dataAccessObjects/shop/ShopDao";
import Item from "../../types/Item";
import ComponentReadyChecks from "../types/readyCheck/ComponentReadyChecks";

interface Deps {
    categoryDao: CategoryDao;
    shopDao: ShopDao;
    itemDao: ItemDao;
}

export default class ComponentReadyChecksImpl implements ComponentReadyChecks {

    constructor(private deps: Deps) { }

    async categories(): Promise<boolean> {
        const categories = await this.deps.categoryDao.selectAllCategories()
        return this.hasAtLeastOneElement(categories);
    }

    async shops(): Promise<boolean> {
        const shops = await this.deps.shopDao.selectAllShops();
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
        return this.deps.itemDao.selectAllItems();
    }

    private async selectAllFoodItems(): Promise<Item[]> {
        const items = await this.selectAllItems();
        return items.filter(item => item.food);
    }
}
