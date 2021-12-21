import constants from './constants';
import { join } from 'path';

const routes: Route[] = [
    {
        name: 'Shopping List',
        routePath: 'shoppingList',
        icon: '📝'
    },
    {
        name: 'Items',
        routePath: 'items',
        icon: '🥔'
    },
    {
        name: 'Categories',
        routePath: 'categories',
        icon: '🆎'
    },
    {
        name: 'Shops',
        routePath: 'shops',
        icon: '🏪'
    },
    {
        name: 'meals',
        routePath: 'meals',
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

/**
 * creates the menu and injects it into the
 * document.
 */
export function injectMenuElements() {
    createMenuElement();
    const menuRouteElements = routes.map(route => {
        const routeEl = document.createElement('a');
        routeEl.href = join(__dirname, '../', `/${constants.componentsFolderName}/${route.routePath}/index.html`);
        routeEl.innerHTML = `<span class='icon'>${route.icon}</span>` + route.name;
        return routeEl
    });
    menuRouteElements.forEach(
        node => document.getElementById(constants.menuId).appendChild(node)
    );
}

interface Route {
    name: string,
    routePath: string,
    icon: string
}