import Item from "../Item";
import Shop from "../Shop";
import { EditableListParams } from "./editableList";

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
    editableListGoodsShopAssignement = 'editableListGoodsShopAssignement'
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
    [Components.editableList]: EditableListParams<any>
    [Components.editableListSortableCategories]: Shop,
    [Components.editableListGoodsShopAssignement]: Item
}
