import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import { refreshReadyMenuComponents } from "../../scripts/menu";
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
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'The item could not be deleted.'
                }
            },
            insertElement: async function (item) {
                const result = await Database.insertItem(item);
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the item. Maybe the item already exists?'
                }
            },
            updateElement: async function (oldItem, newItem) {
                const result = await Database.updateItem(oldItem, newItem);
                // This refresh is for the itemsWithFoodCheck in `menu.ts`
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'An error occoured. Maybe the item already exists?'
                }
            },
            elementKeys: {
                name: {
                    columnName: "Item name",
                    inputType: PossibleInputTypes.text,
                    placeholder: 'Potato / Water / ...'
                },
                category: {
                    columnName: "Category",
                    inputType: PossibleInputTypes.select,
                    selectInputValues: (await Database.selectAllCategories()).map(c => c.category)
                },
                food: {
                    columnName: "Food",
                    inputType: PossibleInputTypes.checkbox,
                    checkboxCheckedInitialy: true,
                    description: "You can only use the item in a meal when the item is marked as 'Food'. You can (but musn't) optimize your overview while creating meals through this option."
                }
            },
            additionalEditableListActions: [{
                buttonIcon: constants.icons.shop,
                buttonTitle: 'Set availability of the item in shops',
                component: Components.editableListGoodsShopAssignement
            }]
        }

        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#itemList"),
            params
        );
    }
}