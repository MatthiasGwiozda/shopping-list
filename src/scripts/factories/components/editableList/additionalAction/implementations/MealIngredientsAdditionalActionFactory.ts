import MealIngredients from "../../../../../components/mealIngredients/MealIngredients";
import Meal from "../../../../../types/Meal";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class MealIngredientsAdditionalActionFactory implements AdditionalActionFactory<Meal> {

    getComponent(container: HTMLElement, meal: Meal): MealIngredients {
        return new MealIngredients(container, meal);
    }
}
