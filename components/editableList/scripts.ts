import ComponentUtilities, { Components } from "../../scripts/utilities/ComponentUtilities";

export default class EditableList {
    insertEditableList(htmlElement: HTMLElement) {
        ComponentUtilities.injectComponent(Components.editableList, htmlElement);
    }
}
