import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Meal from "../../types/Meal";
import Component from "../Component";

export default class Meals extends Component<Components.meals> {
    rendered() {
        this.createEditableList()
    }

    private async createEditableList() {
        const params: EditableListParams<Meal> = {
            getTableContent: async () => await Database.selectAllMeals(),
            deleteElement: async function (meal) {
                const result = await Database.deleteMeal(meal);
                return {
                    result,
                    message: result ? null : 'The meal could not be deleted.'
                }
            },
            insertElement: async function (meal) {
                const result = await Database.insertMeal(meal);
                return {
                    result,
                    message: result ? null : 'An error occoured while saving the meal. Maybe the meal already exists?'
                }
            },
            updateElement: async function (oldMeal, newMeal) {
                const result = await Database.updateMeal(oldMeal, newMeal);
                return {
                    result,
                    message: result ? null : 'An error occoured. Maybe the meal already exists?'
                }
            },
            elementKeys: {
                name: {
                    columnName: 'Meal',
                    inputType: PossibleInputTypes.text
                },
                component: {
                    columnName: 'Meal - Component',
                    inputType: PossibleInputTypes.checkbox
                }
            },
            additionalEditableListActions: [{
                buttonIcon: constants.icons.item,
                buttonTitle: 'Edit ingredients, recipe and more',
                component: Components.editableListMealIngredients
            }]
        }

        Component.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#mealsList"),
            params
        );
    }
}