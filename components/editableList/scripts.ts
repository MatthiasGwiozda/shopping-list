import constants from "../../scripts/constants";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
import { ActionResult, TableContent } from "../../types/components/editableList";
import Component from "../Component";

enum EditableListFiles {
    deleteButton = 'deleteButton.html',
    addNewButton = 'addNewButton.html',
    saveButton = 'saveButton.html'
}

export default class EditableList extends Component<Components.editableList> {

    rendered() {
        this.insertRows();
    }

    private gethtmlFromFile(file: EditableListFiles): HTMLElement {
        const html = HtmlUtilities.getFileAsHtmlElement(
            `${constants.componentsFolderName}/${Components.editableList}/partials/${file}`
        )
        return html.firstChild as HTMLElement;
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
     * @returns a tr - element with the data contained in the item.
     */
    private getTableRowForItem(item: TableContent[0]): HTMLElement {
        const { deleteElement } = this.componentParameters;
        const tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(item), 'td');
        const tr = document.createElement('tr');
        const deleteButtonTd = document.createElement('td');
        const deleteButton = this.gethtmlFromFile(EditableListFiles.deleteButton);
        for (const td of tds) {
            tr.append(td);
        }
        deleteButtonTd.append(deleteButton);
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
        tr.append(deleteButtonTd);
        return tr;
    }

    private insertData(tableContent: TableContent) {
        let rows: HTMLElement[] = [];
        tableContent.forEach(row => rows.push(this.getTableRowForItem(row)));
        rows.forEach(row => this.addToTableBody(row))
    }

    private getFormSubmitFunction(formId: string, tr: HTMLElement) {
        const { insertElement } = this.componentParameters
        const { showMessageOfActionResult } = this;
        const instance = this;
        /**
         * the value of "this" is getting changed in an onsubmit - event.
         * Thats why a function is returned here.
         */
        return async function (this: GlobalEventHandlers, e: SubmitEvent) {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const element = {};
            formData.forEach((value, key) => element[key] = value);
            const res = await insertElement(element);
            showMessageOfActionResult(res);
            if (res.result) {
                instance.removeForm(formId);
                tr.remove();
                instance.addToTableBody(
                    instance.getTableRowForItem(element)
                );
            }
        }
    }

    /**
     * @returns the unique id of the form
     */
    private createForm(tr: HTMLElement): string {
        const form = document.createElement('form');
        this.container.append(form);
        const formId = (+new Date()).toString();
        form.onsubmit = this.getFormSubmitFunction(formId, tr);
        /**
         * a random number for the form - id
         */
        return form.id = formId;
    }

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
     */
    private createAddNewElementActions(formId: string, tr: HTMLElement) {
        const saveButton = this.gethtmlFromFile(EditableListFiles.saveButton);
        saveButton.setAttribute('form', formId);
        const cancelButton = this.gethtmlFromFile(EditableListFiles.deleteButton);
        cancelButton.title = 'cancel';
        cancelButton.onclick = () => { tr.remove(); this.removeForm(formId); };
        this.addToTableRow([saveButton, cancelButton], tr);
    }

    private insertAddElementButton() {
        const button = this.gethtmlFromFile(EditableListFiles.addNewButton);
        button.onclick = async () => {
            // show form to add new element
            /**
             * the keys, which needs to be inserted
             */
            const keys = this.getElementKeys();
            // create new tr
            const tr = document.createElement('tr');
            const formId = this.createForm(tr);
            for (const key of keys) {
                const input = document.createElement('input');
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
            this.createAddNewElementActions(formId, tr);
            this.addToTableBody(tr);
        }
        this.container.append(button);
    }

    private async insertRows() {
        const { getTableContent } = this.componentParameters;
        const tableContent = await getTableContent();
        this.insertColumns();
        this.insertData(tableContent);
        this.insertAddElementButton();
    }
}
