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
 * Parameters for the Components
 */
export type ComponentParameters = {
    [Components.categories]: any
    [Components.items]: any
    [Components.meals]: any
    [Components.shoppingList]: any
    [Components.shops]: any
    [Components.editableList]: EditableListParams<any>
}
