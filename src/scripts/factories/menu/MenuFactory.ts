import Menu from "../../menu/Menu";

export default class MenuFactory {

    public getMenu(): Menu {
        return new Menu();
    }
}
