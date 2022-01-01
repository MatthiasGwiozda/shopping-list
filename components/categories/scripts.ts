import Database from "../../scripts/Database";
import Category from "../../types/Category";
import { Components } from "../../types/components/Components";
import { EditableListParams } from "../../types/components/editableList";
import Component from "../Component";

export default class Categories extends Component<Components.categories> {
    rendered() {
        this.createEditableList();
    }
    // create editableList for categories
    private async createEditableList() {
        const params: EditableListParams<Category> = {
            getTableContent: async () => await Database.selectAllCategories(),
            deleteElement: async function (category) {
                const result = await Database.deleteCategory(category);
                return {
                    result,
                    message: result ? null : 'The category could not be deleted. Maybe it is used in an item or a shop. Delete it there first'
                }
            },
            insertElement: async function (category) {
                const result = await Database.insertCategory(category);
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the category. Maybe the category already exists?'
                }
            },
            updateElement: async function (oldCategory, newCategory) {
                const result = await Database.updateCategory(oldCategory, newCategory);
                return {
                    result,
                    message: result ? null : 'Update could not be performed.'
                }
            },
            elementKeys: [
                "category"
            ]
        }

        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#categoriesList"),
            params
        );
    }
}
