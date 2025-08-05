import constants from "../../../constants";
import CategoriesFactory from "../../../factories/components/menuComponents/implementations/CategoriesFactory";
import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "../../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../../types/menuRoute/NamedIcon";
import MenuRouteCreator from "../MenuRouteCreator";

interface Deps {
    categoriesFactory: CategoriesFactory;
}

export default class CategoriesMenuRoute extends MenuRouteCreator {

    constructor(private deps: Deps) {
        super()
    }

    protected getNamedIcon(): NamedIcon {
        return new NamedIcon('Categories', constants.icons.category);
    }

    protected getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories> {
        return new MenuRouteBehavior(this.deps.categoriesFactory)
    }
}
