import Category from "../../types/Category";
import GoodsShops from "../../types/GoodsShops";
import Item from "../../types/Item";
import Meal from "../../types/Meal";
import MealInformation from "../../types/MealInformation";
import Shop from "../../types/Shop";
import ShoppingListMeal from "../../types/ShoppingListMeal";

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
    deleteItem(item: Item): Promise<boolean>;
    insertItem(item: Item): Promise<boolean>;
    updateItem(oldItem: Item, newItem: Item): Promise<boolean>;
}

export interface MealAccessObject {
    selectAllMeals(): Promise<Meal[]>;
    selectMealsInformation(): Promise<MealInformation[]>;
}

export interface ShoppingListAccessObject {
    selectAllMealShoppingList(): Promise<ShoppingListMeal[]>;
    insertMealToShoppingList(mealName: string): Promise<boolean>;
    updateMealShoppingListQuantity(mealName: string, quantity: number): Promise<boolean>;
    deleteMealFromShoppingList(mealName: string): Promise<boolean>;
}
