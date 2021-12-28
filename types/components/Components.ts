
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
    [Components.editableList]: {
        /**
         * the columns, which will be included in the EditableList.
         * The value of the column is the value, which is shown in a single cell
         * of the table.
         */
        tableContent: { [columnName: string]: any }[]
    }
}
