import { EditableListParams } from "./editableList";

/**
 * all Components, which are available in the app.
 */
export enum Components {
    categories = 'categories',
    items = 'items',
    meals = 'meals',
    shoppingList = 'shoppingList',
    shops = 'shops',
    editableList = 'editableList'
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
}
