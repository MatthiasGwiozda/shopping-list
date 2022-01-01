
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

type ManipulationFunction<ElementType> = (element: ElementType) => Promise<ActionResult>;

export interface EditableListParams<ElementType> {
    /**
     * the columns, which will be included in the EditableList.
     * The value of the column is the value, which is shown in a single cell
     * of the table.
     */
    getTableContent: () => Promise<ElementType[]>,
    /**
     * when the user wishes to delete an element, this function
     * will be called with the element, which should be deleted, passed as parameter
     * into the function.
     * When an error occours, 
     */
    deleteElement: ManipulationFunction<ElementType>,
    /**
     * is called when the user typed in the data
     * for a new element and clicked on the save - button.
     */
    insertElement: ManipulationFunction<ElementType>,
    /**
     * Function to update the contents of an element.
     */
    updateElement: (oldElement: ElementType, newElement: ElementType) => Promise<ActionResult>
    /**
     * the keys of the elements, which are managed by this editableList
     */
    elementKeys: (keyof ElementType)[];
}
