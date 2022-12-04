import MealIngredients from "../../../../../../components/MealIngredients/scripts";
import Meal from "../../../../../types/Meal";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class MealIngredientsAdditionalActionFactory implements AdditionalActionFactory<Meal> {

    getComponent(container: HTMLElement, meal: Meal): MealIngredients {
        return new MealIngredients(container, meal);
    }
}
