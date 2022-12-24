import Component from '../../components/Component';
import { Components } from '../types/components/Components';
import constants from '../constants';
import componentRoutes from './componentRoutes';

/**
 * creates the menu - div element.
 */
function createMenu() {
    const menu = document.createElement('div');
    menu.id = constants.menuId;
    document.getElementById(constants.containerId).prepend(menu);
}

function setActiveMenuItem(routeEl: HTMLElement) {
    const activeClass = 'active';
    const anchors = document.querySelectorAll(`#${constants.menuId} > a`);
    anchors.forEach(anchor => {
        anchor.classList.remove(activeClass);
    })
    routeEl.classList.add(activeClass);
}

function goToRoute(component: Components) {
    Component.injectComponent(component, document.getElementById(constants.contentId));
    const { htmlElement } = componentRoutes.find(componentRoute => componentRoute.component == component)
    setActiveMenuItem(htmlElement);
}

function createMenuRouteElements() {
    componentRoutes.forEach(componentRoute => {
        const { component, icon, name } = componentRoute;
        const routeEl = document.createElement('a');
        routeEl.onclick = () => {
            goToRoute(component);
        }
        routeEl.innerHTML = `<span class='icon'>${icon}</span>` + name;
        componentRoute.htmlElement = routeEl;
    });
}

/**
 * The menu indicates wether certain menu - elements may be used.
 * This function checks, if the menu elements may be used and sets
 * the ready - state for each menu element.
 */
export async function refreshReadyMenuComponents() {
    for (const componentRoute of componentRoutes) {
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

/**
 * creates the menu and injects it into the
 * document.
 * additionally opens the default component
 */
export function injectMenuElements() {
    createMenu();
    createMenuRouteElements();
    const menuRouteElements = componentRoutes.map(componentRoute => componentRoute.htmlElement);
    menuRouteElements.forEach(
        node => document.getElementById(constants.menuId).appendChild(node)
    );
    // now open the default - component
    goToRoute(Components.shoppingList);
    refreshReadyMenuComponents();
}
