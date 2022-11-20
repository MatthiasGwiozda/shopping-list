import Database from "../../scripts/Database";
import { refreshReadyMenuComponents } from "../../scripts/menu";
import Category from "../../scripts/types/Category";
import { Components } from "../../scripts/types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../scripts/types/components/editableList";
import Component from "../Component";
import categoriesPartials from "./categoriesPartials";

export default class Categories extends Component {

    constructor(container: HTMLElement) {
        super(container);
        this.createEditableList();
    }

    protected getHtmlTemplate(): string {
        return categoriesPartials.template;
    }

    // create editableList for categories
    private async createEditableList() {
        const params: EditableListParams<Category> = {
            getTableContent: async () => await Database.selectAllCategories(),
            deleteElement: async function (category) {
                const result = await Database.deleteCategory(category);
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'The category could not be deleted. Maybe it is used in an item. Change the category of the items first'
                }
            },
            insertElement: async function (category) {
                const result = await Database.insertCategory(category);
                refreshReadyMenuComponents();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the category. Maybe the category already exists?'
                }
            },
            updateElement: async function (oldCategory, newCategory) {
                const result = await Database.updateCategory(oldCategory, newCategory);
                return {
                    result,
                    message: result ? null : 'An error occoured. Maybe the category already exists?'
                }
            },
            elementKeys: {
                category: {
                    columnName: "Category",
                    inputType: PossibleInputTypes.text,
                    placeholder: 'Beverages / Sweets / ...'
                }
            }
        }

        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#categoriesList"),
            params
        );
    }
}
