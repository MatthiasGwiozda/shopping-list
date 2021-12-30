import constants from "../../scripts/constants";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
import { TableContent } from "../../types/components/editableList";
import Component from "../Component";

export default class EditableList extends Component<Components.editableList> {

    rendered() {
        this.insertRows();
    }

    private getDeleteButton(): HTMLElement {
        const deleteButton = HtmlUtilities.getFileAsHtmlElement(
            `${constants.componentsFolderName}/${Components.editableList}/deleteButton.html`
        )
        return deleteButton.firstChild as HTMLElement;
    }

    /**
     * inserts the column - names in the table
     * it is assumed that every element in the array
     * has the same keys in every object.
     */
    private insertColumns(tableContent: TableContent) {
        const ths = HtmlUtilities.makeHtmlElementsFromContent(Object.keys(tableContent[0]), 'th');
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

    private insertData(tableContent: TableContent) {
        const { deleteElement } = this.componentParameters;
        let rows: HTMLElement[] = [];
        tableContent.forEach(row => {
            const tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(row), 'td');
            const tr = HtmlUtilities.createElement('tr');
            const deleteButtonTd = HtmlUtilities.createElement('td');
            const deleteButton = this.getDeleteButton();
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
                    if (res.message) {
                        alert(res.message);
                    }
                }
            }
            tr.append(deleteButtonTd);
            rows.push(tr);
        })
        const tbody = this.container.querySelector('tbody');
        rows.forEach(row => tbody.append(row))
    }

    /**
     * when called, the table will be shown in the dom.
     */
    private showTable() {
        this.container.querySelector('table').classList.add('show');
    }

    private async insertRows() {
        const { getTableContent } = this.componentParameters;
        const tableContent = await getTableContent();
        /**
         * it can happen that an editableList is called and no elements are
         * returned by "getTableContent".
         */
        if (tableContent.length) {
            this.insertColumns(tableContent);
            this.insertData(tableContent);
            this.showTable();
        }
    }
}
