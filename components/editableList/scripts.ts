import constants from "../../scripts/constants";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
import { ActionResult, TableContent } from "../../types/components/editableList";
import Component from "../Component";

enum EditableListFiles {
    deleteButton = 'deleteButton.html',
    addNewButton = 'addNewButton.html',
    saveButton = 'saveButton.html',
    editButton = 'editButton.html'
}

export default class EditableList extends Component<Components.editableList> {

    rendered() {
        this.insertRows();
    }

    private getElementKeys(): string[] {
        return this.componentParameters.elementKeys as string[];
    }

    /**
     * inserts the column - names in the table
     * it is assumed that every element in the array
     * has the same keys in every object.
     */
    private insertColumns() {
        const ths = HtmlUtilities.makeHtmlElementsFromContent(this.getElementKeys(), 'th');
        const tableHeadRow = this.container.querySelector('thead > tr');
        for (const th of ths) {
            tableHeadRow.prepend(th);
        }
    }

    private getStringRepresentation(element: TableContent[0]): string {
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
     * @param item the item, which should be deleted when the button is clicked
     * @param tr the row, which will be removed when an item was successfully deleted.
     * @returns the delete - button
     */
    private getDeleteButton(item: TableContent[0], tr: HTMLElement): HTMLElement {
        const { deleteElement } = this.componentParameters;
        const deleteButton = this.gethtmlFromFile(EditableListFiles.deleteButton);
        deleteButton.onclick = async () => {
            if (DialogUtilities.confirm('Are you sure to delete this element? \n' + this.getStringRepresentation(item))) {
                const res = await deleteElement(item);
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
     * @returns the edit - button for a specific item.
     * @param tr the row, which will be edited, when the edit - button was clicked
     * @param item the item, which will be edited.
     */
    private getEditButton(item: TableContent[0], tr: HTMLElement): HTMLElement {
        const editButton = this.gethtmlFromFile(EditableListFiles.editButton);
        editButton.onclick = async () => {
            /**
             * editTR: the tableRow with the input - fields to update
             * an element.
             */
            const { tr: editTR, firstInput } = this.createFormInTableRow({
                item,
                oldTr: tr
            });
            tr.replaceWith(editTR);
            firstInput.focus();
        }
        return editButton;
    }

    /**
     * @returns a tr - element with the data contained in the item.
     */
    private getTableRowForItem(item: TableContent[0]): HTMLElement {
        // first create the content of the item
        const tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(item), 'td');
        const tr = document.createElement('tr');
        for (const td of tds) {
            tr.append(td);
        }
        // create the edit - button
        const editButton = this.getEditButton(item, tr);
        // now create the delete - button.
        const deleteButton = this.getDeleteButton(item, tr);
        this.addToTableRow([editButton, deleteButton], tr);
        return tr;
    }

    /**
     * inserts the current data in the table based
     * on the tableContent.
     */
    private insertData(tableContent: TableContent) {
        let rows: HTMLElement[] = [];
        tableContent.forEach(row => rows.push(this.getTableRowForItem(row)));
        rows.forEach(row => this.addToTableBody(row))
    }

    /**
     * @param oldElement when the oldElement is given, it is assumed that an update
     * should take place. Otherwise an item will be inserted.
     * @param tr the table - row where the input - fields are included.
     */
    private getFormSubmitFunction(formId: string, tr: HTMLElement, oldElement: TableContent[0] = null) {
        const { insertElement, updateElement } = this.componentParameters
        const { showMessageOfActionResult } = this;
        const instance = this;
        /**
         * the value of "this" is getting changed in an onsubmit - event.
         * Thats why a function is returned here.
         */
        return async function (this: GlobalEventHandlers, e: SubmitEvent) {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const newElement = {};
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
                const newItemRow = instance.getTableRowForItem(newElement);
                tr.replaceWith(newItemRow);
            }
        }
    }

    /**
     * @returns the unique id of the form
     * @param element the element for which the form was created.
     * when this parameter was set to null it is assumed that a form
     * for a new element was created.
     */
    private createForm(tr: HTMLElement, element: TableContent[0]): string {
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
        const cancelButton = this.gethtmlFromFile(EditableListFiles.deleteButton);
        cancelButton.title = 'cancel';
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
    private createFormInTableRow(updateElement?: UpdateElement): InsertOrUpdateButtonResponse {
        // show form to add new element
        /**
         * the keys, which needs to be inserted
         */
        const keys = this.getElementKeys();
        // create new tr
        const tr = document.createElement('tr');
        const formId = this.createForm(tr, updateElement?.item);
        let firstInput: HTMLElement;
        for (const key of keys) {
            const input = document.createElement('input');
            if (firstInput == null) {
                firstInput = input;
            }
            input.setAttribute('form', formId);
            input.setAttribute('placeholder', key);
            input.setAttribute('name', key);
            input.required = true;
            /**
             * @todo: the type of certain attributes could
             * be different from 'text'. This could be a new
             * parameter to pass into the editableList - component.
             */
            input.setAttribute('type', 'text');
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
    private insertAddNewButtons(tableContent: TableContent) {
        if (tableContent.length) {
            /**
             * When there is at least one element,
             * the button should appear additionally at the bottom of the page.
             */
            this.container.append(this.getAddNewButton());
        }
        this.container.prepend(this.getAddNewButton());
    }

    private async insertRows() {
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

interface UpdateElement {
    item: TableContent[0],
    /**
     * the original table - row before the update took place.
     */
    oldTr: HTMLElement
}