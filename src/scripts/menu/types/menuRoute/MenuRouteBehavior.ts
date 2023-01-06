import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteReadyCheck from "../readyCheck/MenuRouteReadyCheck";

export default class MenuRouteBehavior<
    FactoryType extends MenuComponentFactories
> {
    constructor(
        public componentFactory: FactoryType,
        public readyCheck?: MenuRouteReadyCheck,
    ) { }
}
