import constants from "../../scripts/constants";
import FileUtilities from "../../scripts/utilities/FileUtilities";
import HtmlUtilities from "../../scripts/utilities/htmlUtilities";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class EditableList extends Component<Components.editableList> {
    private readonly deleteButton = FileUtilities.getFileContent(
        `${constants.componentsFolderName}/${Components.editableList}/deleteButton.html`
    )

    rendered() {
        this.insertRows();
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
        tableHeadRow.innerHTML = ths + tableHeadRow.innerHTML;
    }

    private insertData() {
        const { tableContent } = this.componentParameters;
        let rows = '';
        tableContent.forEach(row => {
            let tds = HtmlUtilities.makeHtmlElementsFromContent(Object.values(row), 'td');
            rows += `<tr>${tds}${this.deleteButton}</tr>`;
        })
        const tbody = this.container.querySelector('tbody');
        tbody.innerHTML = rows + tbody.innerHTML;
    }

    private insertRows() {
        this.insertColumns();
        this.insertData();
    }
}
