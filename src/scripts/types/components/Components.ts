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
    mealCollection = 'mealCollection',
    shoppingListCollection = 'shoppingListCollection'
}
