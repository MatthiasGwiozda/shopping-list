import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "./MenuRouteBehavior";
import NamedIcon from "./NamedIcon";

export default class MenuRoute {

    constructor(
        public namedIcon: NamedIcon,
        public behavior: MenuRouteBehavior<MenuComponentFactories>
    ) { }
}
