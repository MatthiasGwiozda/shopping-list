import Category from "../../types/Category";
import { CurrentItems } from "../../types/components/itemCollection";
import GoodsShops from "../../types/GoodsShops";
import Item from "../../types/Item";
import Meal from "../../types/Meal";
import MealInformation from "../../types/MealInformation";
import Shop from "../../types/Shop";
import ShoppingListItem from "../../types/ShoppingListItem";
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
    insertMeal(meal: Meal): Promise<boolean>;
    updateMeal(oldMeal: Meal, newMeal: Meal, updateRecipe?: boolean): Promise<boolean>;
    deleteMeal(meal: Meal): Promise<boolean>;
    selectMealsInformation(): Promise<MealInformation[]>;
    selectMealFood(mealName: string): Promise<CurrentItems[]>;
    insertMealFood(mealName: string, foodName: string): Promise<boolean>;
    deleteMealFood(mealName: string, foodName: string): Promise<boolean>;
    updateMealFoodQuantity(mealName: string, foodName: string, quantity: number): Promise<boolean>;
    selectRelatedMealComponents(mealName: string): Promise<string[]>;
    setRelatedMealComponent(mealName: string, componentMealName: string): Promise<boolean>;
    deleteRelatedMealComponent(mealName: string, componentMealName: string): Promise<boolean>;
    selectMealsForComponentMeal(componentMealName: string): Promise<string[]>;
}

export interface ShoppingListAccessObject {
    selectAllShoppingLists(): Promise<ShoppingListItem[]>;
    updateShoppingListName(shoppingListName: string, newShoppingListName: string): Promise<boolean>;
    insertItemToShoppingList(itemName: string, shoppingListName: string): Promise<boolean>;
    deleteItemFromShoppingList(itemName: string, shoppingListName: string): Promise<boolean>;
    updateShoppingListItemQuantity(itemName: string, shoppingListName: string, quantity: number): Promise<boolean>;
    updateShoppingListActiveState(shoppingListName: string, active: boolean): Promise<boolean>;
    insertShoppingList(shoppingListName: string): Promise<boolean>;
    deleteShoppingList(shoppingListName: string): Promise<boolean>;
    selectShoppingListItems(shoppingListName: string): Promise<CurrentItems[]>;
    selectAllMealShoppingList(): Promise<ShoppingListMeal[]>;
    insertMealToShoppingList(mealName: string): Promise<boolean>;
    updateMealShoppingListQuantity(mealName: string, quantity: number): Promise<boolean>;
    deleteMealFromShoppingList(mealName: string): Promise<boolean>;
    generateShoppingList(shopId: number, availableShopItems: boolean): Promise<string>;
    getRecipesOfSelectedMeals(): Promise<string>;
}
