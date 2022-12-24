import ApplicationMenuRoutes from "../../menu/ApplicationMenuRoutes";
import Menu from "../../menu/Menu";

export default class MenuFactory {

    public getMenu(): Menu {
        return new Menu(ApplicationMenuRoutes);
    }
}
