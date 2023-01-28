import ApplicationMenuRoutes from "../../menu/MenuRoutesFactory";
import Menu from "../../menu/Menu";

export default class MenuFactory {

    public getMenu(): Menu {
        return new Menu(ApplicationMenuRoutes);
    }
}
