import MenuRoute from "./menuRoute/MenuRoute";

export default interface MenuItem {
    menuRoute: MenuRoute;
    htmlElement: HTMLAnchorElement;
}
