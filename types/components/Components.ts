
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
    [Components.categories]: never
    [Components.items]: never
    [Components.meals]: never
    [Components.shoppingList]: never
    [Components.shops]: never
    [Components.editableList]: never
}
