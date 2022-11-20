import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import { Components } from "../../scripts/types/components/Components";
import { EditableListParams, PossibleInputTypes } from "../../scripts/types/components/editableList";
import Meal from "../../scripts/types/Meal";
import Component from "../Component";
import DialogUtilities from '../../scripts/utilities/DialogUtilities';
import mealsPartials from "./MealsPartials";

export default class Meals extends Component {

    constructor(container: HTMLElement) {
        super(container);
        this.createEditableList()
    }

    protected getHtmlTemplate(): string {
        return mealsPartials.template
    }

    private getBulletPointList(elements: string[]): string {
        let result = '';
        elements.forEach(element => result += `- ${element}\n`);
        return result;
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
            updateElement: async (oldMeal, newMeal) => {
                let update = true;
                if (!oldMeal.component && newMeal.component) {
                    const meals = await Database.selectRelatedMealComponents(oldMeal.name);
                    if (meals.length > 0) {
                        const relatedMeals = this.getBulletPointList(meals);
                        const confirmMessage = this.getChangeToComponentMessage(newMeal.name, relatedMeals);
                        update = DialogUtilities.confirm(confirmMessage);
                    }
                } else if (oldMeal.component && !newMeal.component) {
                    const meals = await Database.selectMealsForComponentMeal(oldMeal.name);
                    if (meals.length > 0) {
                        const relatedMeals = this.getBulletPointList(meals);
                        const confirmMessage = this.getChangeToFullMealMessage(relatedMeals);
                        update = DialogUtilities.confirm(confirmMessage);
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
                    columnName: 'Meal name',
                    inputType: PossibleInputTypes.text,
                    placeholder: 'Lasagna / Pizza / ...'
                },
                component: {
                    columnName: 'Meal component',
                    inputType: PossibleInputTypes.checkbox,
                    description: 'A meal component is a reusable part of a "full meal". You can assign non component meals to a meal component. When you generate the shopping list with the full meal, the ingredients of the assigned meal components will be shown in your generated list.'
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

    private getChangeToFullMealMessage(relatedMeals: string): string {
        const message =
            'The following meals are assigned to this component:\n\n' +
            relatedMeals + '\n' +
            'Do you want to remove the meals from this component and switch to a "non component meal"?';
        return message;
    }

    private getChangeToComponentMessage(mealName: string, relatedMeals: string): string {
        const message =
            `The following related meals won't be related to "${mealName}" anymore:\n\n` +
            relatedMeals + '\n' +
            'A meal component cannot have components assigned to itself.\n' +
            `Do you want to save "${mealName}" as a component?`;
        return message;
    }
}