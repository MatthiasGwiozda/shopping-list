import ComponentFactory from "../../factories/components/interfaces/ComponentFactory";
import MenuRouteReadyCheck from "./MenuRouteReadyCheck";

export default interface MenuRoute {
    name: string;
    componentFactory: ComponentFactory;
    icon: string;
    readyCheck?: MenuRouteReadyCheck;
}
