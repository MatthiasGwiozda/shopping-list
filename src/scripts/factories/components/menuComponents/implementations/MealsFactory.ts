import Meals, { MealsDeps } from "../../../../components/meals/Meals";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class MealsFactory implements MenuComponentFactory {

    constructor(private deps: MealsDeps) { }

    getComponent(container: HTMLElement): Meals {
        return new Meals(container, this.deps);
    }
}
