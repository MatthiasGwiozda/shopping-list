import MenuComponentFactories from "../../factories/components/menuComponents/interfaces/MenuComponentFactories";
import MenuRoute from "./menuRoute/MenuRoute";

export default interface MenuItem {
    menuRoute: MenuRoute<MenuComponentFactories>;
    htmlElement: HTMLAnchorElement;
}
