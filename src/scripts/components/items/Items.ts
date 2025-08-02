import constants from "../../constants";
import Database from "../../database/Database";
import GoodsShopAssignementAdditionalActionFactory from "../../factories/components/editableList/additionalAction/implementations/GoodsShopAssignementAdditionalActionFactory";
import ObserverableComponent from "../ObserverableComponent";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Item from "../../types/Item";
import EditableList from "../editableList/EditableList";
import itemsPartials from "./itemsPartials";

export interface ItemsDeps {
    goodsShopAssignementAdditionalActionFactory: GoodsShopAssignementAdditionalActionFactory;
}

export default class Items extends ObserverableComponent {

    constructor(container: HTMLElement, private deps: ItemsDeps) {
        super(container);
        this.createEditableList();
    }

    protected getHtmlTemplate(): string {
        return itemsPartials.template;
    }

    private async createEditableList() {
        const params: EditableListParams<Item> = {
            getTableContent: async () => await Database.selectAllItems(),
            deleteElement: async (item) => {
                const result = await Database.deleteItem(item);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'The item could not be deleted.'
                }
            },
            insertElement: async (item) => {
                const result = await Database.insertItem(item);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the item. Maybe the item already exists?'
                }
            },
            updateElement: async (oldItem, newItem) => {
                const result = await Database.updateItem(oldItem, newItem);
                // This notification is for the itemsWithFoodCheck in `menu.ts`
                this.notifyObservers();
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
                factory: this.deps.goodsShopAssignementAdditionalActionFactory
            }]
        }

        const editableListContainer = this.container.querySelector<HTMLElement>("#itemList");
        new EditableList(editableListContainer, params);
    }
}