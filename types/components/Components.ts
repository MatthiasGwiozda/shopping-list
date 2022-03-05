import Item from "../Item";
import Meal from "../Meal";
import Shop from "../Shop";
import { EditableListParams } from "./editableList";
import ItemCollectionParams from "./itemCollection";

/**
 * all Components, which are available in the app.
 * please note that the string must equal the foldername
 * of the component.
 */
export enum Components {
    categories = 'categories',
    items = 'items',
    meals = 'meals',
    shoppingList = 'shoppingList',
    shops = 'shops',
    editableList = 'editableList',
    editableListSortableCategories = 'editableListSortableCategories',
    editableListGoodsShopAssignement = 'editableListGoodsShopAssignement',
    editableListMealIngredients = 'editableListMealIngredients',
    itemCollection = 'itemCollection',
    mealCollection = 'mealCollection'
}

/**
 * a placeholder for all Components, which
 * doesn't need parameters.
 */
type PlaceholderParameter = {
    text: "I dont't need parameters"
}

/**
 * Parameters for the Components
 */
export type ComponentParameters = {
    [Components.categories]: PlaceholderParameter
    [Components.items]: PlaceholderParameter
    [Components.meals]: PlaceholderParameter
    [Components.shoppingList]: PlaceholderParameter
    [Components.shops]: PlaceholderParameter
    [Components.mealCollection]: PlaceholderParameter
    [Components.editableList]: EditableListParams<any>
    [Components.editableListSortableCategories]: Shop
    [Components.editableListGoodsShopAssignement]: Item
    [Components.editableListMealIngredients]: Meal
    [Components.itemCollection]: ItemCollectionParams
}
