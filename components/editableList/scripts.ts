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
                const res = await deleteElement(row);
                if (res.result) {
                    // refresh component and load data again
                    this.reloadComponent();
                }
                if (res.message) {
                    alert(res.message);
                }
            }
            tr.append(deleteButtonTd);
            rows.push(tr);
        })
        const tbody = this.container.querySelector('tbody');
        rows.forEach(row => tbody.append(row))
    }

    private async insertRows() {
        const { getTableContent } = this.componentParameters;
        const tableContent = await getTableContent();
        this.insertColumns(tableContent);
        this.insertData(tableContent);
    }
}
