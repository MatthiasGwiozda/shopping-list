import constants from "../../constants";
import DialogUtilities from "../../utilities/DialogUtilities";
import HtmlUtilities from "../../utilities/htmlUtilities";
import InputUtilities from "../../utilities/InputUtilities";
import UniqueUtilities from "../../utilities/UniqueUtilities";
import { ActionResult, ColumnMeta, EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Component from "../Component";
import editableListPartials from "./EditableListPartials";

export default class EditableList<EditableListElement> extends Component {
    static readonly activeAdditionalActionClass = 'additionalActionActive';
    static readonly checkboxType = 'checkbox';
    static readonly checkboxChecked = '✔';
    static readonly checkboxUnChecked = '❌';

    private additionalActionButtons: HTMLButtonElement[] = [];
    /**
     * while this property is set to true,
     * an input - field won't be focused when clicking
     * on the edit - button.
     */
    private focusLock = false;
    /**
     * holds the information, how many elements
     * were requested to be saved, but are not persisted, yet.
     */
    private quedSaveActions = 0;

    constructor(
        container: HTMLElement,
        private params: EditableListParams<EditableListElement>
    ) {
        super(container);
        this.insertElementsAndActions();
    }

    protected getHtmlTemplate(): string {
        return editableListPartials.template;
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
        const { elementKeys } = this.params;
        const humanReadableKeys = Object.values(elementKeys).map(
            ({ columnName }) => columnName
        );
        return humanReadable ? humanReadableKeys : Object.keys(elementKeys);
    }

    /**
     * @returns a string representation of the value, which is included in a <td> - Element.
     * When inputs are used, the value of the input will be returned.
     */
    private getValueOfTableData(htmlElement: HTMLElement): string {
        const { innerText, children } = htmlElement;
        let compareValue = innerText;
        const input = children[0];
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
            if (input instanceof HTMLInputElement && input.type == EditableList.checkboxType) {
                compareValue = input.checked ? EditableList.checkboxChecked : EditableList.checkboxUnChecked;
            } else {
                compareValue = input.value;
            }
        }
        return compareValue;
    }

    private getAllTableRows() {
        return this.container.querySelectorAll<HTMLTableRowElement>('tbody > tr');
    }

    /**
     * sorts the elements in the editable list.
     * @param sortIndex the index of the <td> - Element. The innerText of
     * this td - Element will be used to sort the editableList.
     */
    private sortElements(sortIndex: number) {
        // disable all active action - buttons first:
        const activeButtons = this.additionalActionButtons
            .filter(button => button.classList.contains(constants.activeActionButtonClass));
        activeButtons.forEach(button => button.click());
        // now sort the elements
        const children = this.getAllTableRows();
        const tableRows: HTMLElement[] = [];
        children.forEach(row => tableRows.push(row));
        tableRows.sort((row1, row2) => {
            /*
             * When editing elements, input - fields are shown in the table. In this
             * case the sorting must use the value of the input - field and not
             * the innerText of the html - Element.
             */
            const compareValue1 = this.getValueOfTableData(row1.children[sortIndex] as HTMLElement);
            const compareValue2 = this.getValueOfTableData(row2.children[sortIndex] as HTMLElement);
            if (compareValue1 == compareValue2) {
                return 0;
            }
            return compareValue1 > compareValue2 ? 1 : -1;
        });
        const tbody = this.getTableBody();
        tableRows.forEach(row => tbody.appendChild(row))
        // click on the action - buttons again:
        activeButtons.forEach(button => button.click());
    }

    /**
     * @param humanReadableName this is the columnName of the element.
     * @returns The description of the element from the elementKeys.
     * Note that the description is an optional parameter and might be undefined.
     */
    private getDescriptionForHumanReadableName(humanReadableName: string): string {
        const { elementKeys } = this.params;
        const elementKeyValues = Object.values<ColumnMeta>(elementKeys);
        const element = elementKeyValues.find(el => el.columnName == humanReadableName);
        return element?.description;
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
        let sortIndex = ths.length - 1;
        for (const th of ths) {
            const i = sortIndex;
            th.onclick = () => {
                this.sortElements(i);
                const sortingClass = 'sortedBy';
                ths.forEach(th => th.classList.remove(sortingClass));
                th.classList.add(sortingClass);
            };
            sortIndex--;
            const description = this.getDescriptionForHumanReadableName(th.innerText);
            let title = `Sort by ${th.innerText}`;
            if (description != null) {
                title += '. ' + description;
            }
            th.title = title;
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
        const { deleteElement } = this.params;
        const deleteButton = HtmlUtilities.getRootNode<HTMLButtonElement>(editableListPartials.deleteButton);
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
        const editButton = HtmlUtilities.getRootNode<HTMLButtonElement>(editableListPartials.editButton);
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
            if (!this.focusLock) {
                firstInput.focus();
            }
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
        return this.params.additionalEditableListActions?.map(action => {
            const { factory, buttonIcon, buttonTitle } = action;
            const actionButton = HtmlUtilities.getRootNode<HTMLButtonElement>(editableListPartials.additionalActionButton);
            actionButton.innerText = buttonIcon;
            actionButton.title = buttonTitle;
            let actionButtonTr: HTMLElement;
            actionButton.onclick = () => {
                actionButton.classList.toggle(constants.activeActionButtonClass);
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
                    factory.getComponent(actionButtonTd, element);
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
        this.additionalActionButtons.push(...additionalActionButtons);
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
            const { inputType } = this.params.elementKeys[key];
            if (inputType == PossibleInputTypes.checkbox) {
                elementWithSortedKeys[key] = element[key] ? EditableList.checkboxChecked : EditableList.checkboxUnChecked;
            } else {
                elementWithSortedKeys[key] = element[key];
            }
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
     * @returns true, when the element is visible.
     * The headlines should not be counted into this calculation.
     * @see https://stackoverflow.com/a/5354536/6458608
     */
    private isElementVisible(element: HTMLElement): boolean {
        if (element != null) {
            var rect = element.getBoundingClientRect();
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(
                rect.bottom < 0 ||
                rect.top - viewHeight >= 0 ||
                rect.top <= 50
            );
        }
        return false;
    }

    /**
     * focuses the next input in the document, if one was found.
     */
    private focusNextInput() {
        const inputs = this.container.querySelectorAll<HTMLElement>('tr:not(.additionalActionActive) input');
        let focusedAlready = false;
        inputs?.forEach(input => {
            if (!focusedAlready && this.isElementVisible(input)) {
                input.focus();
                focusedAlready = true;
            }
        })
    }

    /**
     * @param oldElement when the oldElement is given, it is assumed that an update
     * should take place. Otherwise an element will be inserted.
     * @param tr the table - row where the input - fields are included.
     */
    private getFormSubmitFunction(formId: string, tr: HTMLElement, oldElement: EditableListElement = null) {
        const { insertElement, updateElement } = this.params
        const { showMessageOfActionResult, focusNextInput } = this;
        const instance = this;
        /**
         * the value of "this" is getting changed in an onsubmit - event.
         * Thats why a function is returned here.
         */
        return async function (this: GlobalEventHandlers, e: SubmitEvent) {
            e.preventDefault();
            instance.quedSaveActions++;
            const formData = new FormData(e.target as HTMLFormElement);
            const newElement = {} as EditableListElement;
            formData.forEach((value, key) => newElement[key] = value);
            let res: ActionResult = {
                result: true
            };
            if (oldElement != null) {
                /**
                 * call the database only if the element has changed.
                 * This optimizes the performance of the "save all" - button
                 */
                let update = false;
                /**
                 * FormData doesn't return a value for a checkbox, when it's not checked.
                 * Therfore we have to make sure that we get all the relevant keys of the old and new elements.
                 */
                const allKeys = new Set([
                    ...Object.keys(newElement),
                    ...Object.keys(oldElement)
                ])
                const allIterableKeys = Array.from(allKeys);
                for (const key of allIterableKeys) {
                    if (newElement[key] != oldElement[key]) {
                        update = true;
                        break;
                    }
                }
                if (update) {
                    res = await updateElement(oldElement, newElement);
                }
            } else {
                res = await insertElement(newElement);
            }
            instance.quedSaveActions--;
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
        const formId = UniqueUtilities.getNextId();
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

    private getTableBody() {
        return this.container.querySelector('tbody');
    }

    private addToTableBody(element: HTMLElement) {
        const tbody = this.getTableBody();
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
        const saveButton = HtmlUtilities.getRootNode(editableListPartials.saveButton);
        saveButton.setAttribute('form', formId);
        const cancelButton = HtmlUtilities.getRootNode(editableListPartials.cancelButton);
        cancelButton.onclick = () => {
            if (oldTr == null) {
                // remove the row only when it's a "insert"
                tr.remove();
            } else {
                // it's an update - action and the user clicked the cancel - button
                tr.replaceWith(oldTr);
            }
            this.removeForm(formId);
            this.focusNextInput();
        };
        /**
         * Click the cancel - button when the user uses escape
         * in this tr.
         */
        tr.addEventListener('keyup', function (e) {
            /**
             * 27 is the code for the escape - button.
             */
            if (e.code == "Escape") {
                cancelButton.click();
            }
        })
        this.addToTableRow([saveButton, cancelButton], tr);
    }

    private requireInputAndAddValue(input: HTMLSelectElement | HTMLInputElement, elementKeyValue: any) {
        input.required = true;
        if (elementKeyValue != null) {
            // every input should get the current value
            input.value = elementKeyValue;
        }
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
            const { columnName, inputType, selectInputValues, checkboxCheckedInitialy, placeholder } = this.params.elementKeys[key];
            /**
             * the value of the specific key for the updateElement.
             */
            const elementKeyValue = updateElement?.element[key];
            let input: HTMLSelectElement | HTMLInputElement;
            if (inputType == PossibleInputTypes.select) {
                input = document.createElement('select');
                selectInputValues.forEach(inputValue => {
                    const option = document.createElement('option');
                    option.value = inputValue;
                    option.innerText = inputValue;
                    input.appendChild(option);
                });
                this.requireInputAndAddValue(input, elementKeyValue);
            } else if (inputType == PossibleInputTypes.text) {
                input = document.createElement('input');
                InputUtilities.setDefaultTextInputAttributes(input);
                this.requireInputAndAddValue(input, elementKeyValue);
                // the placeholder should use the human - readable keys of the element
                input.setAttribute('placeholder', placeholder ? placeholder : columnName);
            } else if (inputType == PossibleInputTypes.checkbox) {
                input = document.createElement('input');
                input.setAttribute('type', EditableList.checkboxType);
                if (
                    (updateElement == null && checkboxCheckedInitialy) ||
                    elementKeyValue
                ) {
                    input.checked = true;
                }
                input.value = "1";
            }
            if (firstInput == null) {
                firstInput = input;
            }
            input.setAttribute('form', formId);
            input.setAttribute('name', key);
            this.addToTableRow([input], tr);
        }
        this.createFormActions(formId, tr, updateElement?.oldTr);
        return { tr, firstInput };
    }

    private getAddNewButton(): HTMLElement {
        const button = HtmlUtilities.getRootNode(editableListPartials.addNewButton);
        button.classList.add(constants.addNewButtonClass);
        button.onclick = async () => {
            // make function generic
            const { tr, firstInput } = this.createFormInTableRow();
            this.addToTableBody(tr);
            firstInput.focus();
        }
        return button;
    }

    private getSaveAllButton(): HTMLButtonElement {
        const saveAllButton = HtmlUtilities.getRootNode<HTMLButtonElement>(editableListPartials.saveAllButton);
        saveAllButton.onclick = () => {
            const saveIcon = '💾';
            const hourglass = '⏳';
            saveAllButton.disabled = true;
            saveAllButton.innerText = saveAllButton.innerText.replace(saveIcon, hourglass);
            /**
             * This timeout exists so that the button will show
             * the loading - icon while saving many items at once.
             */
            setTimeout(() => {
                const saveButtons = this.container.querySelectorAll<HTMLButtonElement>('.saveItemButton');
                saveButtons.forEach(button => button.click());
                const interval = setInterval(() => {
                    if (this.quedSaveActions == 0) {
                        saveAllButton.innerText = saveAllButton.innerText.replace(hourglass, saveIcon);
                        saveAllButton.disabled = false;
                        clearInterval(interval);
                    }
                }, 100)
            }, 100)
        }
        return saveAllButton;
    }

    private getEditAllButton(): HTMLElement {
        const button = HtmlUtilities.getRootNode(editableListPartials.editAllButton);
        button.onclick = async () => {
            this.focusLock = true;
            const editButtons = this.container.querySelectorAll<HTMLButtonElement>('.editItemButton');
            editButtons.forEach(button => button.click());
            this.focusLock = false;
            this.focusNextInput();
        }
        return button;
    }

    private getTopActionContainer() {
        return this.container.querySelector('.topActionContainer');
    }

    private getBottomActionContainer() {
        return this.container.querySelector('.bottomActionContainer');
    }

    /**
     * Inserts the addNewButton + editAllButton at the top and bottom of the
     * table.
     */
    private insertGeneralButtons(tableContent: EditableListElement[]) {
        if (tableContent.length) {
            /**
             * When there is at least one element,
             * the button should appear additionally at the bottom of the page.
             */
            const bottomActionContainer = this.getBottomActionContainer();
            bottomActionContainer.append(this.getAddNewButton());
            bottomActionContainer.append(this.getEditAllButton());
            bottomActionContainer.append(this.getSaveAllButton());
        }
        const topActionContainer = this.getTopActionContainer();
        topActionContainer.append(this.getAddNewButton());
        topActionContainer.append(this.getEditAllButton());
        topActionContainer.append(this.getSaveAllButton());
    }

    /**
     * all additional actions, which are in use at the moment,
     * will be deactivated when calling this function.
     */
    private deactivateAllAdditionalAction() {
        const buttons = this.container.querySelectorAll<HTMLButtonElement>('.additionalActionButton.' + constants.activeActionButtonClass);
        buttons.forEach(button => button.click());
    }

    /**
     * Inserts the search - input together with
     * the functionality.
     */
    private insertSearchInput() {
        const input = HtmlUtilities.getRootNode<HTMLInputElement>(editableListPartials.searchInput);
        input.oninput = () => {
            this.deactivateAllAdditionalAction();
            const { value } = input;
            const rows = this.getAllTableRows();
            /**
             * the number of all the columns in this editableList.
             * one column represents the actions and is removed.
             */
            const numberOfColumns = this.getNumberOfColumns() - 1;
            rows.forEach(row => {
                let visible = false;
                for (let i = 0; i < numberOfColumns; i++) {
                    const tableDataToCheck = row.children[i] as HTMLElement;
                    const tableDataValue = this.getValueOfTableData(tableDataToCheck);
                    if (tableDataValue.toLowerCase().includes(value.toLowerCase())) {
                        visible = true;
                        break;
                    }
                }
                if (visible) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            })
        }
        const topActionContainer = this.getTopActionContainer();
        topActionContainer.prepend(input);
    }

    private async insertElementsAndActions() {
        const { getTableContent } = this.params;
        const tableContent = await getTableContent();
        this.insertColumns();
        this.insertData(tableContent);
        this.insertGeneralButtons(tableContent);
        this.insertSearchInput();
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