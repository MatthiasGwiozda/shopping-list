import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../types/components/editableList";
import Meal from "../../types/Meal";
import Component from "../Component";
import DialogUtilities from '../../scripts/utilities/DialogUtilities';
import * as dedent from 'dedent';

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
                let update = true;
                if (!oldMeal.component && newMeal.component) {
                    update = DialogUtilities.confirm(dedent`
                    When switching "${newMeal.name}" to a component, the meal components, which are currently
                    assigned to "${newMeal.name}" won't be assigned anymore.
                    A meal component cannot have components assigned to itself.
                    Do you want to save?`);
                }
                if (update) {
                    const result = await Database.updateMeal(oldMeal, newMeal, false);
                    return {
                        result,
                        message: result ? null : 'An error occoured. Maybe the meal already exists?'
                    }
                }
                return { result: false }
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