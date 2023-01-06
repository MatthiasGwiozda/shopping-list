import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteReadyCheck from "../readyCheck/MenuRouteReadyCheck";
import NamedIcon from "./NamedIcon";

export default interface MenuRoute<
    FactoryType extends MenuComponentFactories
> {
    namedIcon: NamedIcon;
    componentFactory: FactoryType;
    readyCheck?: MenuRouteReadyCheck;
}
