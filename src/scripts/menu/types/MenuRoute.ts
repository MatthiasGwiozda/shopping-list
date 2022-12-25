import MenuComponentFactory from "../../factories/components/menuComponents/interfaces/MenuComponentFactory";
import MenuRouteReadyCheck from "./MenuRouteReadyCheck";

export default interface MenuRoute {
    name: string;
    componentFactory: MenuComponentFactory;
    icon: string;
    readyCheck?: MenuRouteReadyCheck;
}
