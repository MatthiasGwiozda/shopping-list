
export interface ActionResult {
    /**
     * Whether the action was successful or not
     */
    result: boolean,
    /**
     * A message, which will be shown to the user.
     */
    message?: string
}

export type TableContent = { [columnName: string]: any }[]
type ManipulationFunction = (element: any) => Promise<ActionResult>;

export interface EditableListParams {
    /**
     * the columns, which will be included in the EditableList.
     * The value of the column is the value, which is shown in a single cell
     * of the table.
     */
    getTableContent: () => Promise<TableContent>,
    /**
     * when the user wishes to delete an element, this function
     * will be called with the element, which should be deleted, passed as parameter
     * into the function.
     * When an error occours, 
     */
    deleteElement: ManipulationFunction,
    /**
     * is called when the user typed in the data
     * for a new element and clicked on the save - button.
     */
    insertElement: ManipulationFunction
}
