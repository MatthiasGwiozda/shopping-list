import Component from '../components/Component';
import ObserverableComponent from '../components/ObserverableComponent';
import constants from '../constants';
import MenuComponentFactories from '../factories/components/menuComponents/interfaces/MenuComponentFactories';
import Observer from '../types/observer/Observer';
import MenuRouteReadyChecker from './readyCheck/MenuRouteReadyChecker';
import MenuItem from './types/MenuItem';
import MenuRoute from './types/menuRoute/MenuRoute';

interface MenuDeps {
    menuRoutes: MenuRoute[],
    menuRouteReadyChecker: MenuRouteReadyChecker,
}

export default class Menu implements Observer {
    private menuItems: MenuItem[];

    constructor(public deps: MenuDeps) {
        this.menuItems = this.createMenuItems(deps.menuRoutes);
    }

    public addMenuToDocument() {
        this.createMenuDivElement();
        this.addMenuHtmlElementsToMenu();
        this.openDefaultComponent();
        this.deps.menuRouteReadyChecker.applyReadyChecks(this.menuItems);
    }

    public observerSubjectUpdated(): void {
        this.deps.menuRouteReadyChecker.applyReadyChecks(this.menuItems);
    }

    private createMenuItems(menuRoutes: MenuRoute[]): MenuItem[] {
        return menuRoutes.map(menuRoute => {
            const { icon, name } = menuRoute.namedIcon;
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
        const { componentFactory } = menuRoute.behavior;
        const container = document.getElementById(constants.contentId);
        this.injectComponentAndRegisterObserver(componentFactory, container);
        this.setActiveMenuItem(htmlElement);
    }

    private injectComponentAndRegisterObserver(componentFactory: MenuComponentFactories, container: HTMLElement) {
        // currently the Component constructor injects the Component html by itself
        const component = componentFactory.getComponent(container);
        this.registerObserver(component);
    }

    private setActiveMenuItem(routeEl: HTMLElement) {
        const activeClass = 'active';
        const anchors = document.querySelectorAll(`#${constants.menuId} > a`);
        anchors.forEach(anchor => {
            anchor.classList.remove(activeClass);
        })
        routeEl.classList.add(activeClass);
    }

    private registerObserver(component: Component) {
        if (component instanceof ObserverableComponent) {
            component.registerObserver(this);
        }
    }
}
