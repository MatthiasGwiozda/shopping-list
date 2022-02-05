import constants from "../../scripts/constants";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
import { ActionResult, PossibleInputTypes } from "../../types/components/editableList";
import Component from "../Component";

enum EditableListFiles {
    deleteButton = 'deleteButton.html',
    addNewButton = 'addNewButton.html',
    saveButton = 'saveButton.html',
    editButton = 'editButton.html',
    cancelButton = 'cancelButton.html',
    additionalActionButton = 'additionalActionButton.html'
}

export default class EditableList<EditableListElement> extends Component<Components.editableList> {
    static readonly activeAdditionalActionClass = 'additionalActionActive';

    rendered() {
        this.insertElementsAndActions();
    }

    /**
     * @returns the keys of the element in the order which
     * were defined in the parameter "elementKeys".
     * @param humanReadable when this parameter is set to "false" (default - value),
     * the function will return the actual keys of the EditableListElement.
     * When "true" is used, the function will return
     * the values, which are human - readable.
     */
    private getElementKeys(humanReadable = false): string[] {
        const { elementKeys } = this.componentParameters;
        const humanReadableKeys = Object.values(elementKeys).map(
            ({ columnName }) => columnName
        );
        return humanReadable ? humanReadableKeys : Object.keys(elementKeys);
    }

    /**
     * inserts the column - names in the table
     * it is assumed that every element in the array
     * has the same keys in every object.
     */
    private insertColumns() {
        let ths = HtmlUtilities.makeHtmlElementsFromContent(this.getElementKeys(true), 'th');
        const tableHeadRow = this.container.querySelector('thead > tr');
        // reverse the elements, because the column - names are getting PREPENDED to the tableHeadRow
        ths = ths.reverse();
        for (const th of ths) {
            tableHeadRow.prepend(th);
        }
    }

    private getStringRepresentation(element: EditableListElement): string {
        let str = '';
        for (const key in element) {
            str += `${key}: ${element[key]}\n`
        }
        return str;
    }

    private async showMessageOfActionResult(res: ActionResult) {
        if (res.message) {
            DialogUtilities.alert(res.message);
        }
    }

    /**
     * @param element the element, which should be deleted when the button is clicked
     * @param tr the row, which will be removed when an element was successfully deleted.
     * @returns the delete - button
     */
    private getDeleteButton(element: EditableListElement, tr: HTMLElement): HTMLButtonElement {
        const { deleteElement } = this.componentParameters;
        const deleteButton = this.gethtmlFromFile<HTMLButtonElement>(EditableListFiles.deleteButton);
        deleteButton.onclick = async () => {
            if (DialogUtilities.confirm('Are you sure to delete this element? \n' + this.getStringRepresentation(element))) {
                const res = await deleteElement(element);
                if (res.result) {
                    // remove the row
                    tr.remove();
                }
                this.showMessageOfActionResult(res);
            }
        }
        return deleteButton;
    }

    /**
     * @returns the edit - button for a specific element.
     * @param tr the row, which will be edited, when the edit - button was clicked
     * @param element the element, which will be edited.
     */
    private getEditButton(element: EditableListElement, tr: HTMLElement): HTMLButtonElement {
        const editButton = this.gethtmlFromFile<HTMLButtonElement>(EditableListFiles.editButton);
        editButton.onclick = async () => {
            /**
             * editTR: the tableRow with the input - fields to update
             * an element.
             */
            const { tr: editTR, firstInput } = this.createFormInTableRow({
                element,
                oldTr: tr
            });
            tr.replaceWith(editTR);
            firstInput.focus();
        }
        return editButton;
    }

    /**
     * @returns the number of all the columns in this editableList.
     * 1 column is reserved for the actions
     */
    private getNumberOfColumns(): number {
        return this.getElementKeys().length + 1;
    }

    /**
     * @param tr the row for the element
     * @param otherActionButtons the buttons, which will be disabled when activating an additional - action
     * @returns the buttons for the additional actions
     */
    private getAdditionalActionButtons(
        element: EditableListElement,
        tr: HTMLTableRowElement,
        otherActionButtons: HTMLButtonElement[]
    ): HTMLButtonElement[] {
        return this.componentParameters.additionalEditableListActions?.map(action => {
            const { component, buttonIcon, buttonTitle } = action;
            const actionButton = this.gethtmlFromFile<HTMLButtonElement>(EditableListFiles.additionalActionButton);
            actionButton.innerText = buttonIcon;
            actionButton.title = buttonTitle;
            let actionButtonTr: HTMLElement;
            actionButton.onclick = () => {
                actionButton.classList.toggle('active');
                if (actionButtonTr != null) {
                    actionButtonTr.remove();
                    actionButtonTr = null;
                    otherActionButtons.forEach(button => button.disabled = false);
                } else {
                    otherActionButtons.forEach(button => button.disabled = true);
                    actionButtonTr = document.createElement('tr');
                    actionButtonTr.classList.add(EditableList.activeAdditionalActionClass);
                    const actionButtonTd = document.createElement('td');
                    actionButtonTd.colSpan = this.getNumberOfColumns();
                    actionButtonTr.append(actionButtonTd);
                    tr.after(actionButtonTr);
                    Component.injectComponent<any>(component, actionButtonTd, element);
                }
            }
            return actionButton;
        });
    }

    /**
     * Inserts the actions to the table - row.
     * The following actions are inserted through this function:
     * - editbutton
     * - deletebutton
     * - additionalEditableListActions (this is a parameter, of the EditableList - class)
     */
    private insertActionsToRow(element: EditableListElement, tr: HTMLTableRowElement) {
        // create the edit - button
        const editButton = this.getEditButton(element, tr);
        // now create the delete - button.
        const deleteButton = this.getDeleteButton(element, tr);
        let actions = [editButton, deleteButton];
        // now handle the additional actions
        const additionalActionButtons = this.getAdditionalActionButtons(element, tr, [editButton, deleteButton]);
        if (additionalActionButtons != null) {
            actions = actions.concat(additionalActionButtons);
        }
        this.addToTableRow(actions, tr);
    }

    /**
     * @returns a tr - element with the data contained in the element.
     */
    private getTableRowForElement(element: EditableListElement): HTMLElement {
        const elementWithSortedKeys = {} as EditableListElement;
        for (const key of this.getElementKeys()) {
            elementWithSortedKeys[key] = element[key];
        }
        // first create the content of the element
        const tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(elementWithSortedKeys), 'td');
        const tr = document.createElement('tr');
        for (const td of tds) {
            tr.append(td);
        }
        this.insertActionsToRow(element, tr);
        return tr;
    }

    /**
     * inserts the current data in the table based
     * on the tableContent.
     */
    private insertData(tableContent: EditableListElement[]) {
        let rows: HTMLElement[] = [];
        tableContent.forEach(row => rows.push(this.getTableRowForElement(row)));
        rows.forEach(row => this.addToTableBody(row))
    }

    /**
     * focuses the next input in the document, if one was found.
     */
    private focusNextInput() {
        this.container.querySelector('input')?.focus();
    }

    /**
     * @param oldElement when the oldElement is given, it is assumed that an update
     * should take place. Otherwise an element will be inserted.
     * @param tr the table - row where the input - fields are included.
     */
    private getFormSubmitFunction(formId: string, tr: HTMLElement, oldElement: EditableListElement = null) {
        const { insertElement, updateElement } = this.componentParameters
        const { showMessageOfActionResult, focusNextInput } = this;
        const instance = this;
        /**
         * the value of "this" is getting changed in an onsubmit - event.
         * Thats why a function is returned here.
         */
        return async function (this: GlobalEventHandlers, e: SubmitEvent) {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const newElement = {} as EditableListElement;
            formData.forEach((value, key) => newElement[key] = value);
            let res: ActionResult;
            if (oldElement != null) {
                res = await updateElement(oldElement, newElement);
            } else {
                res = await insertElement(newElement);
            }
            showMessageOfActionResult(res);
            if (res.result) {
                instance.removeForm(formId);
                const newElementRow = instance.getTableRowForElement(newElement);
                tr.replaceWith(newElementRow);
                focusNextInput.apply(instance);
            }
        }
    }

    /**
     * @returns the unique id of the form
     * @param element the element for which the form was created.
     * when this parameter was set to null it is assumed that a form
     * for a new element was created.
     */
    private createForm(tr: HTMLElement, element: EditableListElement): string {
        const form = document.createElement('form');
        this.container.append(form);
        const formId = (+new Date()).toString();
        form.onsubmit = this.getFormSubmitFunction(formId, tr, element);
        /**
         * a random number for the form - id
         */
        return form.id = formId;
    }

    /**
     * creates a new td - element and appends all the elements
     * to it. Finally the td is appended to the given tr.
     */
    private addToTableRow(elements: HTMLElement[], tr: HTMLElement) {
        const td = document.createElement('td');
        elements.forEach((element) => td.append(element));
        tr.append(td);
    }

    private addToTableBody(element: HTMLElement) {
        const tbody = this.container.querySelector('tbody');
        tbody.append(element);
    }

    private removeForm(formId: string) {
        document.getElementById(formId).remove();
    }

    /**
     * creates the save and cancel - button
     * @param oldTr the originalRow before the update took place.
     * When this value is not used, it is assumed that it's an insert - action.
     */
    private createFormActions(formId: string, tr: HTMLElement, oldTr?: HTMLElement) {
        const saveButton = this.gethtmlFromFile(EditableListFiles.saveButton);
        saveButton.setAttribute('form', formId);
        const cancelButton = this.gethtmlFromFile(EditableListFiles.cancelButton);
        cancelButton.onclick = () => {
            if (oldTr == null) {
                // remove the row only when it's a "insert"
                tr.remove();
            } else {
                // it's an update - action and the user clicked the cancel - button
                tr.replaceWith(oldTr);
            }
            this.removeForm(formId);
        };
        this.addToTableRow([saveButton, cancelButton], tr);
    }

    /**
     * @param updateElement the element for which the form was created.
     * when this parameter is not used, it is assumed that a form
     * for a new element should be created.
     */
    private createFormInTableRow(updateElement?: UpdateElement<EditableListElement>): InsertOrUpdateButtonResponse {
        // show form to add new element
        /**
         * the keys, which needs to be inserted
         */
        const keys = this.getElementKeys();
        // create new tr
        const tr = document.createElement('tr');
        const formId = this.createForm(tr, updateElement?.element);
        let firstInput: HTMLElement;
        for (const key of keys) {
            const { columnName, inputType, selectInputValues } = this.componentParameters.elementKeys[key];
            let input: HTMLSelectElement | HTMLInputElement;
            if (inputType == PossibleInputTypes.select) {
                input = document.createElement('select');
                selectInputValues.forEach(inputValue => {
                    const select = document.createElement('option');
                    select.value = inputValue;
                    select.innerText = inputValue;
                    input.appendChild(select);
                })
            } else if (inputType == PossibleInputTypes.text) {
                input = document.createElement('input');
                input.setAttribute('type', 'text');
                /**
                 * at first there is a limit of 100 chars in every input.
                 * This may change in the future.
                 */
                input.maxLength = 100;
            }

            if (updateElement != null) {
                // every input should get the current value
                input.value = updateElement.element[key];
            }
            if (firstInput == null) {
                firstInput = input;
            }
            input.setAttribute('form', formId);
            // the placeholder should use the human - readable keys of the element
            input.setAttribute('placeholder', columnName);
            input.setAttribute('name', key);
            input.required = true;
            this.addToTableRow([input], tr);
        }
        this.createFormActions(formId, tr, updateElement?.oldTr);
        return { tr, firstInput };
    }

    private getAddNewButton(): HTMLElement {
        const button = this.gethtmlFromFile(EditableListFiles.addNewButton);
        button.onclick = async () => {
            // make function generic
            const { tr, firstInput } = this.createFormInTableRow();
            this.addToTableBody(tr);
            firstInput.focus();
        }
        return button;
    }

    /**
     * Inserts the addNewButton at the top and bottom of the
     * table.
     */
    private insertAddNewButtons(tableContent: EditableListElement[]) {
        if (tableContent.length) {
            /**
             * When there is at least one element,
             * the button should appear additionally at the bottom of the page.
             */
            this.container.append(this.getAddNewButton());
        }
        this.container.prepend(this.getAddNewButton());
    }

    private async insertElementsAndActions() {
        const { getTableContent } = this.componentParameters;
        const tableContent = await getTableContent();
        this.insertColumns();
        this.insertData(tableContent);
        this.insertAddNewButtons(tableContent);
    }
}

interface InsertOrUpdateButtonResponse {
    tr: HTMLElement,
    firstInput: HTMLElement
}

interface UpdateElement<ElementType> {
    element: ElementType,
    /**
     * the original table - row before the update took place.
     */
    oldTr: HTMLElement
}