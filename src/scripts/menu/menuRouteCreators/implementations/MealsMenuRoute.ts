import MealsFactory from "../../../factories/components/menuComponents/implementations/MealsFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { ItemsWithFoodReadyCheck } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

export default class MealsMenuRoute extends MenuRouteCreator {

    constructor(
        private readyChecks: ItemsWithFoodReadyCheck
    ) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Meals', '🥗');
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            new MealsFactory(),
            {
                checks: [
                    this.readyChecks.itemsWithFood
                ],
                message: 'Please add at least one "food - item" to create meals'
            }
        )
    }
}
