import MealIngredients, { MealIngredientsDeps } from "../../../../../components/mealIngredients/MealIngredients";
import Meal from "../../../../../types/Meal";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class MealIngredientsAdditionalActionFactory implements AdditionalActionFactory<Meal> {

    constructor(private deps: MealIngredientsDeps) { }

    getComponent(container: HTMLElement, meal: Meal): MealIngredients {
        return new MealIngredients(container, meal, this.deps);
    }
}
