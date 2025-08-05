import ShoppingListFactory from "../../../factories/components/menuComponents/implementations/ShoppingListFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { ShopWithItemsReadyChecks } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

interface ShoppingListMenuRouteDeps {
    readyChecks: ShopWithItemsReadyChecks;
    shoppingListFactory: ShoppingListFactory;
}

export default class ShoppingListMenuRoute extends MenuRouteCreator {

    constructor(private deps: ShoppingListMenuRouteDeps) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Shopping List', '📝');
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            this.deps.shoppingListFactory,
            {
                checks: [
                    () => this.deps.readyChecks.shops(),
                    () => this.deps.readyChecks.items()
                ],
                message: 'Please add items and at least one shop to generate shopping lists'
            }
        )
    }
}
