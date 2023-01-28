import constants from "../../../constants";
import CategoriesFactory from "../../../factories/components/menuComponents/implementations/CategoriesFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import MenuRouteCreator from "../MenuRouteCreator";

export default class CategoriesMenuRoute extends MenuRouteCreator {

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Categories', constants.icons.category);
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(
            new CategoriesFactory(),
        )
    }
}
