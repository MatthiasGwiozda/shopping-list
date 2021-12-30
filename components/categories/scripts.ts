import Database from "../../scripts/Database";
import ComponentUtilities from "../../scripts/utilities/ComponentUtilities";
import Category from "../../types/Category";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class Categories extends Component<Components.categories> {
    rendered() {
        this.createEditableList();
    }
    // create editableList for categories
    private async createEditableList() {
        ComponentUtilities.injectComponent(
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
                }
            }
        );
    }
}
