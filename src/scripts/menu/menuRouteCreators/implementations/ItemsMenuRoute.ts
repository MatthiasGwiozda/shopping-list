import constants from "../../../constants";
import ItemsFactory from "../../../factories/components/menuComponents/implementations/ItemsFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import { CategoriesReadyCheck } from "../../types/readyCheck/ComponentReadyChecks";
import MenuRouteCreator from "../MenuRouteCreator";

export default class ItemsMenuRoute extends MenuRouteCreator {

    constructor(
        private readyChecks: CategoriesReadyCheck
    ) {
        super();
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Items', constants.icons.item);
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            new ItemsFactory(),
            {
                checks: [
                    () => this.readyChecks.categories()
                ],
                message: 'Please add categories before you add items'
            }
        )
    }
}
