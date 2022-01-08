import { Components } from "./Components";

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
     * The keys of this object are equal to the keys in the object of the ElementType.
     * When a key is not present in the set, it will not be shown in the
     * editableList.
     * The values of the elements will be the names of the columns in the editable list.
     */
    elementKeys: { [key in keyof ElementType]?: string };
    additionalEditableListActions?: {
        /**
         * The component, which will get the
         * element (ElementType) as componentParameter.
         * 
         * Please take care of the fact, that the component used here
         * may only get the element to be edited as parameter.
         * 
         * This component will be rendered right under the element for
         * which the action - button was clicked.
         */
        component: Components,
        buttonIcon: string
    }[];
}
