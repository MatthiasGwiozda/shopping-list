import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Shop from "../../types/Shop";
import Component from "../Component";

export default class Shops extends Component<Components.shops> {
    rendered() {
        const params: EditableListParams<Shop> = {
            getTableContent: async () => await Database.selectAllShops(),
            deleteElement: async (shop) => {
                const result = await Database.deleteShop(shop);
                return {
                    result,
                    message: result ? null : 'The shop could not be deleted. Maybe the shop is used somewhere else in the application?'
                }
            },
            insertElement: async function (shop) {
                const result = await Database.insertShop(shop);
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
                    columnName: "Name",
                    inputType: PossibleInputTypes.text
                },
                street: {
                    columnName: "street",
                    inputType: PossibleInputTypes.text
                },
                house_number: {
                    columnName: "house number",
                    inputType: PossibleInputTypes.text
                },
                postal_code: {
                    columnName: "postal code",
                    inputType: PossibleInputTypes.text
                }
            },
            additionalEditableListActions: [{
                buttonIcon: constants.icons.category,
                buttonTitle: 'Edit categories - order',
                component: Components.editableListSortableCategories
            }]
        }
        Component.injectComponent(
            Components.editableList,
            document.getElementById('shopList'),
            params
        )
    }
}