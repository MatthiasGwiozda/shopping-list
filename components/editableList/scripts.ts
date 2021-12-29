import constants from "../../scripts/constants";
import FileUtilities from "../../scripts/utilities/FileUtilities";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
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
    private insertColumns() {
        const { tableContent } = this.componentParameters;
        const ths = HtmlUtilities.makeHtmlElementsFromContent(Object.keys(tableContent[0]), 'th');
        const tableHeadRow = this.container.querySelector('thead > tr');
        for (const th of ths) {
            tableHeadRow.prepend(th);
        }
    }

    private insertData() {
        const { tableContent } = this.componentParameters;
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
            deleteButton.onclick = () => {
                // implement deletion - logic for this element
            }
            tr.append(deleteButtonTd);
            rows.push(tr);
        })
        const tbody = this.container.querySelector('tbody');
        rows.forEach(row => tbody.append(row))
    }

    private insertRows() {
        this.insertColumns();
        this.insertData();
    }
}
