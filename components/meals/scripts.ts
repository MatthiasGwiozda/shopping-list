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

    private getBulletPointList(elements: string[]): string {
        let result = '';
        elements.forEach(element => result += `- ${element}\n`);
        return result;
    }

    private async createEditableList() {
        const instance = this;
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
                    const meals = await Database.selectRelatedMealComponents(oldMeal.name);
                    if (meals.length > 0) {
                        update = DialogUtilities.confirm(dedent`
                        The following related meals won't be related to "${newMeal.name}" anymore:

                        ${instance.getBulletPointList(meals)}
                        A meal component cannot have components assigned to itself.
                        Do you want to save "${newMeal.name}" as a component?`);
                    }
                } else if (oldMeal.component && !newMeal.component) {
                    const meals = await Database.selectMealsForComponentMeal(oldMeal.name);
                    if (meals.length > 0) {
                        update = DialogUtilities.confirm(dedent`
                        The following meals are assigned to this component:

                        ${instance.getBulletPointList(meals)}
                        Do you want to remove the meals from this component and
                        switch to a "non component meal"?
                        `);
                    }
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
                    columnName: 'Meal - component',
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