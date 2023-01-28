import MenuComponentFactories from "../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRoute from "../types/menuRoute/MenuRoute";
import MenuRouteBehavior from "../types/menuRoute/MenuRouteBehavior";
import NamedIcon from "../types/menuRoute/NamedIcon";

export default abstract class MenuRouteCreator {

    protected abstract getNamedIcon(): NamedIcon;
    protected abstract getRouteBehavior(): MenuRouteBehavior<MenuComponentFactories>

    public getMenuRoute(): MenuRoute {
        return new MenuRoute(
            this.getNamedIcon(),
            this.getRouteBehavior()
        )
    }
}
