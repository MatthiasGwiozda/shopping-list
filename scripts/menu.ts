import Component from '../components/Component';
import { Components } from '../types/components/Components';
import constants from './constants';
import Database from './Database';

type MenuComponents = Components.shoppingList | Components.items | Components.categories | Components.shops | Components.meals;
type ReadyCheckComponents = Components.categories | Components.shops | Components.items | "itemsWithFoodCheck";
type ComponentReadyCheck = () => Promise<boolean>;
type ComponentReadyChecks = { [key in ReadyCheckComponents]: ComponentReadyCheck }
interface ComponentRoute {
    name: string,
    component: MenuComponents,
    icon: string,
    /**
     * you can define, which component is
     * dependent of another component.
     * When a dependent component is not ready, the menu - item
     * will be displayed "disabled" to show the user that he
     * cannot use this section without defining other elements.
     */
    componentReadyChecks?: ComponentReadyCheck[],
    /**
     * This message will be set as the title of the
     * menu - item when the menu - item is not ready to be used.
     */
    componentReadyCheckMessage?: string;
    /**
     * After the function "createMenuRouteElements" is used,
     * you can get the html - menu Element for this component
     * route through this property.
     */
    htmlElement?: HTMLAnchorElement
}

const itemsWithFoodCheck = "itemsWithFoodCheck";

function hasAtLeasOneElement(arr: any[]): boolean {
    return arr.length > 0;
}

/**
 * Here are all the possible componentReadyChecks.
 * Don't forget to use the function `refreshReadyMenuComponents()`
 * when adding a new componentReadyCheck. The function must be called
 * when one of the related elements gets inserted or deleted so
 * the menu can adapt it's ready - states dynamically.
 */
const componentReadyChecks: ComponentReadyChecks = {
    [Components.categories]: async () => {
        const elements = await Database.selectAllCategories();
        return hasAtLeasOneElement(elements);
    },
    [Components.shops]: async () => {
        const elements = await Database.selectAllShops();
        return hasAtLeasOneElement(elements);
    },
    [Components.items]: async () => {
        const elements = await Database.selectAllItems();
        return hasAtLeasOneElement(elements);
    },
    [itemsWithFoodCheck]: async () => {
        let items = await Database.selectAllItems();
        items = items.filter(item => item.food);
        return hasAtLeasOneElement(items);
    }
}

const componentRoutes: ComponentRoute[] = [
    {
        name: 'Shopping List',
        component: Components.shoppingList,
        icon: '📝',
        componentReadyChecks: [
            componentReadyChecks[Components.items],
            componentReadyChecks[Components.shops]
        ],
        componentReadyCheckMessage: 'Please add items and at least one shop to generate shopping lists'
    },
    {
        name: 'Items',
        component: Components.items,
        icon: constants.icons.item,
        componentReadyChecks: [
            componentReadyChecks[Components.categories]
        ],
        componentReadyCheckMessage: 'Please add categories before you add items'
    },
    {
        name: 'Categories',
        component: Components.categories,
        icon: constants.icons.category
    },
    {
        name: 'Shops',
        component: Components.shops,
        icon: constants.icons.shop,
        componentReadyChecks: [
            componentReadyChecks[Components.categories]
        ],
        componentReadyCheckMessage: 'Please add categories before you define shops. Every shop may have it\'s own order for categories'
    },
    {
        name: 'meals',
        component: Components.meals,
        icon: '🥗',
        componentReadyChecks: [
            componentReadyChecks[itemsWithFoodCheck]
        ],
        componentReadyCheckMessage: 'Please add at least one "food - item" to create meals'
    }
];

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
