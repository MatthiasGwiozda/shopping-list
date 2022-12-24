import Meals from "../../../../components/meals/scripts";
import ComponentFactory from "../interfaces/ComponentFactory";

export default class MealsFactory implements ComponentFactory {

    getComponent(container: HTMLElement): Meals {
        return new Meals(container);
    }
}
