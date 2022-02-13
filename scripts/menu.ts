import Component from '../components/Component';
import { Components } from '../types/components/Components';
import constants from './constants';

const anchorComponentAttribute = 'data-component';
const componentRoutes: ComponentRoute[] = [
    {
        name: 'Shopping List',
        component: Components.shoppingList,
        icon: '📝'
    },
    {
        name: 'Items',
        component: Components.items,
        icon: constants.icons.item
    },
    {
        name: 'Categories',
        component: Components.categories,
        icon: constants.icons.category
    },
    {
        name: 'Shops',
        component: Components.shops,
        icon: constants.icons.shop
    },
    {
        name: 'meals',
        component: Components.meals,
        icon: '🥗'
    }
];

/**
 * creates the menu - div element.
 */
function createMenuElement() {
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
    setActiveMenuItem(document.querySelector(`#${constants.menuId} > a[${anchorComponentAttribute}=${component}]`));
}

/**
 * creates the menu and injects it into the
 * document.
 * additionally opens the default component
 */
export function injectMenuElements() {
    createMenuElement();
    const menuRouteElements = componentRoutes.map(componentRoute => {
        const routeEl = document.createElement('a');
        routeEl.setAttribute(anchorComponentAttribute, componentRoute.component);
        routeEl.onclick = () => {
            goToRoute(componentRoute.component);
        }
        routeEl.innerHTML = `<span class='icon'>${componentRoute.icon}</span>` + componentRoute.name;
        return routeEl
    });
    menuRouteElements.forEach(
        node => document.getElementById(constants.menuId).appendChild(node)
    );
    // now open the default - component
    goToRoute(Components.shoppingList);
}

interface ComponentRoute {
    name: string,
    component: Components,
    icon: string
}