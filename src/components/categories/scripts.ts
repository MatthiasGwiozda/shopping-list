import Database from "../../scripts/Database";
import MenuObserverComponent from "../../scripts/menu/MenuObserverComponent";
import Category from "../../scripts/types/Category";
import { EditableListParams, PossibleInputTypes } from "../../scripts/types/components/editableList";
import EditableList from "../editableList/scripts";
import categoriesPartials from "./categoriesPartials";

export default class Categories extends MenuObserverComponent {

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
            deleteElement: async (category) => {
                const result = await Database.deleteCategory(category);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'The category could not be deleted. Maybe it is used in an item. Change the category of the items first'
                }
            },
            insertElement: async (category) => {
                const result = await Database.insertCategory(category);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the category. Maybe the category already exists?'
                }
            },
            updateElement: async (oldCategory, newCategory) => {
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

        const editableListContainer = this.container.querySelector<HTMLElement>("#categoriesList");
        new EditableList(editableListContainer, params);
    }
}
