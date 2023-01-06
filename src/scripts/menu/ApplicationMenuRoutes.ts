import constants from '../constants';
import Database from '../database/Database';
import ComponentReadyChecks from './types/readyCheck/ComponentReadyChecks';
import MenuRoute from './types/menuRoute/MenuRoute';
import ShoppingListFactory from '../factories/components/menuComponents/implementations/ShoppingListFactory';
import ItemsFactory from '../factories/components/menuComponents/implementations/ItemsFactory';
import CategoriesFactory from '../factories/components/menuComponents/implementations/CategoriesFactory';
import ShopsFactory from '../factories/components/menuComponents/implementations/ShopsFactory';
import MealsFactory from '../factories/components/menuComponents/implementations/MealsFactory';
import MenuComponentFactories from '../factories/components/menuComponents/interfaces/MenuComponentFactories';
import NamedIcon from './types/menuRoute/NamedIcon';

function hasAtLeasOneElement(arr: any[]): boolean {
    return arr.length > 0;
}

const componentReadyChecks: ComponentReadyChecks = {
    categories: async () => {
        const elements = await Database.selectAllCategories();
        return hasAtLeasOneElement(elements);
    },
    shops: async () => {
        const elements = await Database.selectAllShops();
        return hasAtLeasOneElement(elements);
    },
    items: async () => {
        const elements = await Database.selectAllItems();
        return hasAtLeasOneElement(elements);
    },
    itemsWithFood: async () => {
        let items = await Database.selectAllItems();
        items = items.filter(item => item.food);
        return hasAtLeasOneElement(items);
    }
};

const ApplicationMenuRoutes: MenuRoute<MenuComponentFactories>[] = [
    {
        namedIcon: new NamedIcon('Shopping List', '📝'),
        componentFactory: new ShoppingListFactory(),
        readyCheck: {
            checks: [
                componentReadyChecks.items,
                componentReadyChecks.shops
            ],
            message: 'Please add items and at least one shop to generate shopping lists'
        }
    },
    {
        namedIcon: new NamedIcon('Items', constants.icons.item),
        componentFactory: new ItemsFactory(),
        readyCheck: {
            checks: [
                componentReadyChecks.categories
            ],
            message: 'Please add categories before you add items'
        }
    },
    {
        namedIcon: new NamedIcon('Categories', constants.icons.category),
        componentFactory: new CategoriesFactory(),
    },
    {
        namedIcon: new NamedIcon('Shops', constants.icons.shop),
        componentFactory: new ShopsFactory(),
        readyCheck: {
            checks: [
                componentReadyChecks.categories
            ],
            message: 'Please add categories before you define shops. Every shop may have it\'s own order for categories'
        }
    },
    {
        namedIcon: new NamedIcon('Meals', '🥗'),
        componentFactory: new MealsFactory(),
        readyCheck: {
            checks: [
                componentReadyChecks.itemsWithFood
            ],
            message: 'Please add at least one "food - item" to create meals'
        }
    }
];

export default ApplicationMenuRoutes;
