import AdditionalActionFactory from "../../factories/components/editableList/additionalAction/AdditionalActionFactory";
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

/**
 * every Input - type which can be used in the editableList element. 
 */
export enum PossibleInputTypes {
    text = "text",
    select = "select",
    checkbox = "checkbox"
}

type ManipulationFunction<ElementType> = (element: ElementType) => Promise<ActionResult>;

export interface ColumnMeta {
    /**
     * the name of the column in the editable list.
     */
    columnName: string;
    inputType: PossibleInputTypes;
    /**
     * When using PossibleInputTypes.select, you must provide this property
     * to define the values, which can be selected in the input - field.
     */
    selectInputValues?: string[];
    /**
     * When using PossibleInputTypes.checkbox, you can control
     * if the checkbox should be checked when creating a new
     * element through this property.
     * The default-value is "false".
     */
    checkboxCheckedInitialy?: boolean;
    /**
     * When using PossibleInputTypes.text, you can define a placeholder
     * as an example input for the user.
     */
    placeholder?: string;
    /**
     * You can describe the column throught this property.
     * The description will be shown in the column as a title
     * when hovering on the columnname with the mouse.
     */
    description?: string;
};

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
     */
    elementKeys: {
        [key in keyof ElementType]?: ColumnMeta
    };
    additionalEditableListActions?: {
        factory: AdditionalActionFactory<ElementType>,
        buttonIcon: string,
        buttonTitle: string
    }[];
}
