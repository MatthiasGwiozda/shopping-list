import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteReadyCheck from "../readyCheck/MenuRouteReadyCheck";

export default interface MenuRoute<
    FactoryType extends MenuComponentFactories
> {
    name: string;
    componentFactory: FactoryType;
    icon: string;
    readyCheck?: MenuRouteReadyCheck;
}
