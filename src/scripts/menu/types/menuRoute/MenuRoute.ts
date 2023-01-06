import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteReadyCheck from "../readyCheck/MenuRouteReadyCheck";
import MenuRouteBehavior from "./MenuRouteBehavior";
import NamedIcon from "./NamedIcon";

export default interface MenuRoute<
    FactoryType extends MenuComponentFactories
> {
    namedIcon: NamedIcon;
    behavior: MenuRouteBehavior<MenuComponentFactories>;
    
    componentFactory: FactoryType;
    readyCheck?: MenuRouteReadyCheck;
}
