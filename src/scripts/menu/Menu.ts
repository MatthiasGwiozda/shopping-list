import constants from '../constants';
import MenuItem from './types/MenuItem';
import MenuRoute from './types/MenuRoute';

export default class Menu {
    private menuItems: MenuItem[];

    constructor(menuRoutes: MenuRoute[]) {
        this.menuItems = this.createMenuItems(menuRoutes);
    }

    /**
     * creates the menu and injects it into the
     * document.
     * additionally opens the default component
     */
    public injectMenuElements() {
        this.createMenuDivElement();
        const menuHtmlElements = this.menuItems.map(menuItem => menuItem.htmlElement);
        menuHtmlElements.forEach(
            node => document.getElementById(constants.menuId).appendChild(node)
        );
        // now open the default - component
        this.goToRoute(this.menuItems[0]);
        this.refreshReadyMenuComponents();
    }

    /**
     * The menu indicates wether certain menu - elements may be used.
     * This function checks, if the menu elements may be used and sets
     * the ready - state for each menu element
     */
    public async refreshReadyMenuComponents() {
        for (const menuItem of this.menuItems) {
            const { menuRoute, htmlElement } = menuItem;
            const { componentReadyChecks, componentReadyCheckMessage } = menuRoute;
            if (componentReadyChecks != null) {
                const promises = componentReadyChecks.map(readyCheck => readyCheck());
                const results = await Promise.all(promises);
                const componentIsReady = results.every(result => result);
                const menuNotReadyClass = 'notReady';
                if (componentIsReady) {
                    htmlElement.classList.remove(menuNotReadyClass);
                    htmlElement.removeAttribute('title');
                } else {
                    htmlElement.classList.add(menuNotReadyClass);
                    htmlElement.title = componentReadyCheckMessage;
                }
            }
        }
    }

    private createMenuItems(menuRoutes: MenuRoute[]): MenuItem[] {
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
