import constants from '../constants';
import MenuComponentFactories from '../factories/components/menuComponents/interfaces/MenuComponentFactories';
import MenuRouteReadyChecker from './MenuRouteReadyChecker';
import MenuItem from './types/MenuItem';
import MenuRoute from './types/menuRoute/MenuRoute';

export default class Menu {
    private menuItems: MenuItem[];
    private menuRouteReadyChecker: MenuRouteReadyChecker;

    constructor(menuRoutes: MenuRoute<MenuComponentFactories>[]) {
        this.menuItems = this.createMenuItems(menuRoutes);
        this.menuRouteReadyChecker = new MenuRouteReadyChecker(this.menuItems);
    }

    public addMenuToDocument() {
        this.createMenuDivElement();
        this.addMenuHtmlElementsToMenu();
        this.openDefaultComponent();
        this.menuRouteReadyChecker.applyReadyChecks();
    }

    private createMenuItems(menuRoutes: MenuRoute<MenuComponentFactories>[]): MenuItem[] {
        return menuRoutes.map(menuRoute => {
            const { icon, name } = menuRoute;
            const routeEl = document.createElement('a');
            const menuItem: MenuItem = {
                menuRoute,
                htmlElement: routeEl
            }
            routeEl.innerHTML = `<span class='icon'>${icon}</span>` + name;
            routeEl.onclick = () => {
                this.goToRoute(menuItem);
            }
            return menuItem;
        });
    }

    private createMenuDivElement() {
        const menu = document.createElement('div');
        menu.id = constants.menuId;
        document.getElementById(constants.containerId).prepend(menu);
    }

    private addMenuHtmlElementsToMenu() {
        const menuHtmlElements = this.menuItems.map(menuItem => menuItem.htmlElement);
        menuHtmlElements.forEach(
            node => document.getElementById(constants.menuId).appendChild(node)
        );
    }

    private openDefaultComponent() {
        this.goToRoute(this.menuItems[0]);
    }

    private goToRoute(menuItem: MenuItem) {
        const { menuRoute, htmlElement } = menuItem;
        const { componentFactory } = menuRoute;
        const container = document.getElementById(constants.contentId);
        // currently the Component iconstructor injects the Component html by itself
        componentFactory.getComponent(container);
        this.setActiveMenuItem(htmlElement);
    }

    private setActiveMenuItem(routeEl: HTMLElement) {
        const activeClass = 'active';
        const anchors = document.querySelectorAll(`#${constants.menuId} > a`);
        anchors.forEach(anchor => {
            anchor.classList.remove(activeClass);
        })
        routeEl.classList.add(activeClass);
    }
}
