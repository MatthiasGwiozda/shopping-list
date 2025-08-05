import MealsFactory from "../../../factories/components/menuComponents/implementations/MealsFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { ItemsWithFoodReadyCheck } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

interface MealsMenuRouteDeps {
    readyChecks: ItemsWithFoodReadyCheck;
    mealsFactory: MealsFactory;
}

export default class MealsMenuRoute extends MenuRouteCreator {

    constructor(private deps: MealsMenuRouteDeps) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Meals', '🥗');
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            this.deps.mealsFactory,
            {
                checks: [
                    () => this.deps.readyChecks.itemsWithFood()
                ],
                message: 'Please add at least one "food - item" to create meals'
            }
        )
    }
}
