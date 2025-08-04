import constants from "../../constants";
import SortableCategoriesAdditionalActionFactory from "../../factories/components/editableList/additionalAction/implementations/SortableCategoriesAdditionalActionFactory";
import ObserverableComponent from "../ObserverableComponent";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Shop from "../../types/Shop";
import EditableList from "../editableList/EditableList";
import shopsPartials from "./shopsPartials";
import { ShopAccessObject } from "../../database/dataAccessObjects/AccessObjects";

export interface ShopsDeps {
    shopAccessObject: ShopAccessObject;
    sortableCategoriesAdditionalActionFactory: SortableCategoriesAdditionalActionFactory;
}

export default class Shops extends ObserverableComponent {

    constructor(container: HTMLElement, private deps: ShopsDeps) {
        super(container);
        this.rendered();
    }

    protected getHtmlTemplate(): string {
        return shopsPartials.template
    }

    private rendered() {
        const params: EditableListParams<Shop> = {
            getTableContent: async () => await this.deps.shopAccessObject.selectAllShops(),
            deleteElement: async (shop) => {
                const result = await this.deps.shopAccessObject.deleteShop(shop);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'The shop could not be deleted. Maybe the shop is used somewhere else in the application?'
                }
            },
            insertElement: async (shop) => {
                const result = await this.deps.shopAccessObject.insertShop(shop);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the shop. Maybe the shop already exists?'
                }
            },
            updateElement: async (oldShop, newShop) => {
                const result = await this.deps.shopAccessObject.updateShop(oldShop, newShop);
                return {
                    result,
                    message: result ? null : 'An error occoured. Maybe the shop already exists?'
                }
            },
            elementKeys: {
                shop_name: {
                    columnName: "Shop name",
                    inputType: PossibleInputTypes.text
                },
                street: {
                    columnName: "Street",
                    inputType: PossibleInputTypes.text
                },
                house_number: {
                    columnName: "House number",
                    inputType: PossibleInputTypes.text
                },
                postal_code: {
                    columnName: "Postal code",
                    inputType: PossibleInputTypes.text
                }
            },
            additionalEditableListActions: [{
                buttonIcon: constants.icons.category,
                buttonTitle: 'Edit categories - order',
                factory: this.deps.sortableCategoriesAdditionalActionFactory,
            }]
        }


        const editableListContainer = document.getElementById('shopList');
        new EditableList(editableListContainer, params);
    }
}