import constants from './constants';
import ComponentUtilities from './utilities/ComponentUtilities';
import PathUtilities from './utilities/PathUtilities';

const componentRoutes: ComponentRoute[] = [
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

function isCurrentRoute(route: ComponentRoute) {
    return route.routePath == ComponentUtilities.getCurrentActiveComponent()
}

/**
 * creates the menu and injects it into the
 * document.
 */
export function injectMenuElements() {
    createMenuElement();
    const menuRouteElements = componentRoutes.map(route => {
        const routeEl = document.createElement('a');
        routeEl.href = PathUtilities.getPath(`${constants.componentsFolderName}/${route.routePath}/index.html`);
        routeEl.innerHTML = `<span class='icon'>${route.icon}</span>` + route.name;
        if (isCurrentRoute(route)) {
            routeEl.classList.add('active');
        }
        return routeEl
    });
    menuRouteElements.forEach(
        node => document.getElementById(constants.menuId).appendChild(node)
    );
}

interface ComponentRoute {
    name: string,
    routePath: string,
    icon: string
}