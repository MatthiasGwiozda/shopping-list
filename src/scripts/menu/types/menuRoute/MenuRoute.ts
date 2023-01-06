import MenuComponentFactories from "../../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRouteBehavior from "./MenuRouteBehavior";
import NamedIcon from "./NamedIcon";

export default interface MenuRoute {
    namedIcon: NamedIcon;
    behavior: MenuRouteBehavior<MenuComponentFactories>;
}
