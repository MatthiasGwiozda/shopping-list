import constants from "../../../constants";
import ShopsFactory from "../../../factories/components/menuComponents/implementations/ShopsFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { CategoriesReadyCheck } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

interface ShopsMenuRouteDeps {
    readyChecks: CategoriesReadyCheck;
    shopsFactory: ShopsFactory;
}

export default class ShopsMenuRoute extends MenuRouteCreator {

    constructor(private deps: ShopsMenuRouteDeps) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Shops', constants.icons.shop);
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            this.deps.shopsFactory,
            {
                checks: [
                    () => this.deps.readyChecks.categories()
                ],
                message: 'Please add categories before you define shops. Every shop may have it\'s own order for categories'
            }
        )
    }
} 
