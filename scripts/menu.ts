import constants from './constants';

const routes: Route[] = [
    {
        name: 'Shopping List',
        routePath: 'shoppingList'
    },
    {
        name: 'Items',
        routePath: 'items'
    },
    {
        name: 'Categories',
        routePath: 'categories'
    },
    {
        name: 'Shops',
        routePath: 'shops'
    },
    {
        name: 'meals',
        routePath: 'meals'
    }
];

/**
 * creates the menu and injects it into the
 * document.
 */
export function injectMenuElements() {
    const menuRouteElements = routes.map(route => {
        const routeEl = document.createElement('a');
        routeEl.href = './' + route.routePath;
        routeEl.innerText = route.name;
        routeEl.classList.add('menuRouteElement')
        return routeEl
    });
    menuRouteElements.forEach(
        node => document.getElementById(constants.menuId).appendChild(node)
    );
}

interface Route {
    name: string,
    routePath: string
}