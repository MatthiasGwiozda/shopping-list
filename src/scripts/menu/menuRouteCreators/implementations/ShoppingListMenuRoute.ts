import ShoppingListFactory from "../../../factories/components/menuComponents/implementations/ShoppingListFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { ShopWithItemsReadyChecks } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

export default class ShoppingListMenuRoute extends MenuRouteCreator {

    constructor(
        private readyChecks: ShopWithItemsReadyChecks
    ) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Shopping List', '📝');
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            new ShoppingListFactory(),
            {
                checks: [
                    this.readyChecks.items,
                    this.readyChecks.shops
                ],
                message: 'Please add items and at least one shop to generate shopping lists'
            }
        )
    }
}
