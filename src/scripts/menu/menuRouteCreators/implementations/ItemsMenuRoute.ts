import constants from "../../../constants";
import ItemsFactory from "../../../factories/components/menuComponents/implementations/ItemsFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { CategoriesReadyCheck } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

interface ItemsMenuRouteDeps {
    readyChecks: CategoriesReadyCheck;
    itemsFactory: ItemsFactory;
}

export default class ItemsMenuRoute extends MenuRouteCreator {

    constructor(private deps: ItemsMenuRouteDeps) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Items', constants.icons.item);
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            this.deps.itemsFactory,
            {
                checks: [
                    () => this.deps.readyChecks.categories()
                ],
                message: 'Please add categories before you add items'
            }
        )
    }
}
