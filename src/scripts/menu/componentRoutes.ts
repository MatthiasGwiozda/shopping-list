import { Components } from '../types/components/Components';
import constants from '../constants';
import Database from '../Database';
import ComponentReadyChecks from './types/ComponentReadyChecks';
import MenuRoute from './types/MenuRoute';

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
};

const componentRoutes: MenuRoute[] = [
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
        name: 'Meals',
        component: Components.meals,
        icon: '🥗',
        componentReadyChecks: [
            componentReadyChecks[itemsWithFoodCheck]
        ],
        componentReadyCheckMessage: 'Please add at least one "food - item" to create meals'
    }
];

export default componentRoutes;
