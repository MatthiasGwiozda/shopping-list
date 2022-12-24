import constants from '../constants';
import ApplicationMenuRoutes from './ApplicationMenuRoutes';
import MenuRoute from './types/MenuRoute';

export default class Menu {

    /**
     * creates the menu and injects it into the
     * document.
     * additionally opens the default component
     */
    public injectMenuElements() {
        this.createMenuDivElement();
        this.createMenuRouteElements();
        const menuRouteElements = ApplicationMenuRoutes.map(componentRoute => componentRoute.htmlElement);
        menuRouteElements.forEach(
            node => document.getElementById(constants.menuId).appendChild(node)
        );
        // now open the default - component
        this.goToRoute(ApplicationMenuRoutes[0]);
        this.refreshReadyMenuComponents();
    }

    /**
     * The menu indicates wether certain menu - elements may be used.
     * This function checks, if the menu elements may be used and sets
     * the ready - state for each menu element.
     */
    public async refreshReadyMenuComponents() {
        for (const componentRoute of ApplicationMenuRoutes) {
            const { componentReadyChecks, componentReadyCheckMessage } = componentRoute;
            if (componentReadyChecks != null) {
                const promises = componentReadyChecks.map(readyCheck => readyCheck());
                const results = await Promise.all(promises);
                const componentIsReady = results.every(result => result);
                const { htmlElement } = componentRoute;
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

    private createMenuDivElement() {
        const menu = document.createElement('div');
        menu.id = constants.menuId;
        document.getElementById(constants.containerId).prepend(menu);
    }

    private createMenuRouteElements() {
        ApplicationMenuRoutes.forEach(componentRoute => {
            const { icon, name } = componentRoute;
            const routeEl = document.createElement('a');
            routeEl.onclick = () => {
                this.goToRoute(componentRoute);
            }
            routeEl.innerHTML = `<span class='icon'>${icon}</span>` + name;
            componentRoute.htmlElement = routeEl;
        });
    }

    private goToRoute(menuRoute: MenuRoute) {
        const { componentFactory, htmlElement } = menuRoute;
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
