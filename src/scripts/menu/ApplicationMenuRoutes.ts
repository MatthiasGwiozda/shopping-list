import { Components } from '../types/components/Components';
import constants from '../constants';
import Database from '../Database';
import ComponentReadyChecks from './types/ComponentReadyChecks';
import MenuRoute from './types/MenuRoute';
import ShoppingListFactory from '../factories/components/menuComponents/ShoppingListFactory';
import ItemsFactory from '../factories/components/menuComponents/ItemsFactory';
import CategoriesFactory from '../factories/components/menuComponents/CategoriesFactory';
import ShopsFactory from '../factories/components/menuComponents/ShopsFactory';
import MealsFactory from '../factories/components/menuComponents/MealsFactory';

const itemsWithFoodCheck = "itemsWithFoodCheck";

function hasAtLeasOneElement(arr: any[]): boolean {
    return arr.length > 0;
}

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

const ApplicationMenuRoutes: MenuRoute[] = [
    {
        name: 'Shopping List',
        componentFactory: new ShoppingListFactory(),
        icon: '📝',
        componentReadyChecks: [
            componentReadyChecks[Components.items],
            componentReadyChecks[Components.shops]
        ],
        componentReadyCheckMessage: 'Please add items and at least one shop to generate shopping lists'
    },
    {
        name: 'Items',
        componentFactory: new ItemsFactory(),
        icon: constants.icons.item,
        componentReadyChecks: [
            componentReadyChecks[Components.categories]
        ],
        componentReadyCheckMessage: 'Please add categories before you add items'
    },
    {
        name: 'Categories',
        componentFactory: new CategoriesFactory(),
        icon: constants.icons.category
    },
    {
        name: 'Shops',
        componentFactory: new ShopsFactory(),
        icon: constants.icons.shop,
        componentReadyChecks: [
            componentReadyChecks[Components.categories]
        ],
        componentReadyCheckMessage: 'Please add categories before you define shops. Every shop may have it\'s own order for categories'
    },
    {
        name: 'Meals',
        componentFactory: new MealsFactory(),
        icon: '🥗',
        componentReadyChecks: [
            componentReadyChecks[itemsWithFoodCheck]
        ],
        componentReadyCheckMessage: 'Please add at least one "food - item" to create meals'
    }
];

export default ApplicationMenuRoutes;
