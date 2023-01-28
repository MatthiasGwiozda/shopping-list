import Menu from "../../menu/Menu";
import MenuRoute from "../../menu/types/menuRoute/MenuRoute";

export default class MenuFactory {

    constructor(
        private menuRoutes: MenuRoute[]
    ) { }

    public getMenu(): Menu {
        return new Menu(this.menuRoutes);
    }
}
