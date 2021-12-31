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

    private insertData(tableContent: TableContent) {
        const { deleteElement } = this.componentParameters;
        let rows: HTMLElement[] = [];
        tableContent.forEach(row => {
            const tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(row), 'td');
            const tr = document.createElement('tr');
            const deleteButtonTd = document.createElement('td');
            const deleteButton = this.gethtmlFromFile(EditableListFiles.deleteButton);
            for (const td of tds) {
                tr.append(td);
            }
            deleteButtonTd.append(deleteButton);
            deleteButton.onclick = async () => {
                if (confirm('Are you sure to delete this element? \n' + this.getStringRepresentation(row))) {
                    const res = await deleteElement(row);
                    if (res.result) {
                        // remove the row
                        tr.remove();
                    }
                    this.showMessageOfActionResult(res);
                }
            }
            tr.append(deleteButtonTd);
            rows.push(tr);
        })
        rows.forEach(row => this.addToTableBody(row))
    }

    private getFormSubmitFunction() {
        const { insertElement } = this.componentParameters
        const { reloadComponent, showMessageOfActionResult } = this;
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
                reloadComponent.apply(instance);
            }
        }
    }

    /**
     * @returns the unique id of the form
     */
    private createForm(): string {
        const form = document.createElement('form');
        this.container.append(form);
        form.onsubmit = this.getFormSubmitFunction();
        /**
         * a random number for the form - id
         */
        return form.id = (+new Date()).toString();
    }

    private addToTableRow(element: HTMLElement, tr: HTMLElement) {
        const td = document.createElement('td');
        td.append(element);
        tr.append(td);
    }

    private addToTableBody(element: HTMLElement) {
        const tbody = this.container.querySelector('tbody');
        tbody.append(element);
    }

    private insertAddElementButton(tableContent: TableContent) {
        const button = this.gethtmlFromFile(EditableListFiles.addNewButton);
        button.onclick = async () => {
            // show form to add new element
            /**
             * the keys, which needs to be inserted
             */
            const keys = this.getElementKeys();
            // create new tr
            const tr = document.createElement('tr');
            const formId = this.createForm();
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
                this.addToTableRow(input, tr);
            }
            const saveButton = this.gethtmlFromFile(EditableListFiles.saveButton);
            saveButton.setAttribute('form', formId);
            this.addToTableRow(saveButton, tr);
            this.addToTableBody(tr);
        }
        this.container.append(button);
    }

    private async insertRows() {
        const { getTableContent } = this.componentParameters;
        const tableContent = await getTableContent();
        this.insertColumns();
        this.insertData(tableContent);
        this.insertAddElementButton(tableContent);
    }
}
