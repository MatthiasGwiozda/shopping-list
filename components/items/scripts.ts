import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Item from "../../types/Item";
import Component from "../Component";

export default class Items extends Component<Components.items> {
    rendered() {
        this.createEditableList();
    }

    private async createEditableList() {
        const params: EditableListParams<Item> = {
            getTableContent: async () => await Database.selectAllItems(),
            deleteElement: async function (item) {
                const result = await Database.deleteItem(item);
                return {
                    result,
                    message: result ? null : 'The item could not be deleted.'
                }
            },
            insertElement: async function (item) {
                const result = await Database.insertItem(item);
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the item. Maybe the item already exists?'
                }
            },
            updateElement: async function (oldItem, newItem) {
                const result = await Database.updateItem(oldItem, newItem);
                return {
                    result,
                    message: result ? null : 'An error occoured. Maybe the item already exists?'
                }
            },
            elementKeys: {
                name: {
                    columnName: "Name",
                    inputType: PossibleInputTypes.text
                },
                category: {
                    columnName: "category",
                    inputType: PossibleInputTypes.select,
                    selectInputValues: (await Database.selectAllCategories()).map(c => c.category)
                }
            }
        }

        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#itemList"),
            params
        );
    }
}