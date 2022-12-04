import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import SortableCategoriesAdditionalActionFactory from "../../scripts/factories/components/editableList/additionalAction/implementations/SortableCategoriesAdditionalActionFactory";
import { refreshReadyMenuComponents } from "../../scripts/menu";
import { EditableListParams, PossibleInputTypes } from "../../scripts/types/components/editableList";
import Shop from "../../scripts/types/Shop";
import Component from "../Component";
import EditableList from "../editableList/scripts";
import shopsPartials from "./shopsPartials";

export default class Shops extends Component {

    constructor(container: HTMLElement) {
        super(container);
        this.rendered();
    }

    protected getHtmlTemplate(): string {
        return shopsPartials.template
    }

    private rendered() {
        const params: EditableListParams<Shop> = {
            getTableContent: async () => await Database.selectAllShops(),
            deleteElement: async (shop) => {
                const result = await Database.deleteShop(shop);
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'The shop could not be deleted. Maybe the shop is used somewhere else in the application?'
                }
            },
            insertElement: async function (shop) {
                const result = await Database.insertShop(shop);
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the shop. Maybe the shop already exists?'
                }
            },
            updateElement: async function (oldShop, newShop) {
                const result = await Database.updateShop(oldShop, newShop);
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
                factory: new SortableCategoriesAdditionalActionFactory()
            }]
        }


        const editableListContainer = document.getElementById('shopList');
        new EditableList(editableListContainer, params);
    }
}