import ObserverableComponent from "../ObserverableComponent";
import Category from "../../types/Category";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import EditableList from "../editableList/EditableList";
import categoriesPartials from "./categoriesPartials";
import { CategoryAccessObject } from "../../database/dataAccessObjects/AccessObjects";

export interface CategoriesDeps {
    categoryAccessObject: CategoryAccessObject;
}

export default class Categories extends ObserverableComponent {

    constructor(
        container: HTMLElement,
        private deps: CategoriesDeps,
    ) {
        super(container);
        this.createEditableList();
    }

    protected getHtmlTemplate(): string {
        return categoriesPartials.template;
    }

    // create editableList for categories
    private async createEditableList() {
        const params: EditableListParams<Category> = {
            getTableContent: async () => await this.deps.categoryAccessObject.selectAllCategories(),
            deleteElement: async (category) => {
                const result = await this.deps.categoryAccessObject.deleteCategory(category);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'The category could not be deleted. Maybe it is used in an item. Change the category of the items first'
                }
            },
            insertElement: async (category) => {
                const result = await this.deps.categoryAccessObject.insertCategory(category);
                this.notifyObservers();
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the category. Maybe the category already exists?'
                }
            },
            updateElement: async (oldCategory, newCategory) => {
                const result = await this.deps.categoryAccessObject.updateCategory(oldCategory, newCategory);
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
