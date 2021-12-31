import Database from "../../scripts/Database";
import Category from "../../types/Category";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class Categories extends Component<Components.categories> {
    rendered() {
        this.createEditableList();
    }
    // create editableList for categories
    private async createEditableList() {
        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#categoriesList"),
            {
                getTableContent: async () => await Database.selectAllCategories(),
                deleteElement: async function (category: Category) {
                    const result = await Database.deleteCategory(category);
                    return {
                        result,
                        message: result ? null : 'The category could not be deleted. Maybe it is used in an item or a shop. Delete it there first'
                    }
                },
                insertElement: async function (category: Category) {
                    const result = await Database.insertCategory(category);
                    return {
                        result,
                        message: result ? null : 'An error occoured while saving the category. Maybe the category already exists?'
                    }
                }
            }
        );
    }
}
