import Meals from "../../../../components/meals/Meals";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class MealsFactory implements MenuComponentFactory {

    getComponent(container: HTMLElement): Meals {
        return new Meals(container);
    }
}
