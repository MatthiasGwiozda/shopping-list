import constants from '../constants';
import Database from '../database/Database';
import ComponentReadyChecks from './types/readyCheck/ComponentReadyChecks';
import MenuRoute from './types/menuRoute/MenuRoute';
import ShoppingListFactory from '../factories/components/menuComponents/implementations/ShoppingListFactory';
import ItemsFactory from '../factories/components/menuComponents/implementations/ItemsFactory';
import CategoriesFactory from '../factories/components/menuComponents/implementations/CategoriesFactory';
import ShopsFactory from '../factories/components/menuComponents/implementations/ShopsFactory';
import MealsFactory from '../factories/components/menuComponents/implementations/MealsFactory';
import NamedIcon from './types/menuRoute/NamedIcon';
import MenuRouteBehavior from './types/menuRoute/MenuRouteBehavior';


class MenuRoutesFactory {
    
}



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

const ApplicationMenuRoutes: MenuRoute[] = [
    new MenuRoute(
        new NamedIcon('Shopping List', '📝'),
        new MenuRouteBehavior(
            new ShoppingListFactory(),
            {
                checks: [
                    componentReadyChecks.items,
                    componentReadyChecks.shops
                ],
                message: 'Please add items and at least one shop to generate shopping lists'
            }
        )
    ),
    new MenuRoute(
        new NamedIcon('Items', constants.icons.item),
        new MenuRouteBehavior(
            new ItemsFactory(),
            {
                checks: [
                    componentReadyChecks.categories
                ],
                message: 'Please add categories before you add items'
            }
        )
    ),
    new MenuRoute(
        new NamedIcon('Categories', constants.icons.category),
        new MenuRouteBehavior(
            new CategoriesFactory(),
        )
    ),
    new MenuRoute(
        new NamedIcon('Shops', constants.icons.shop),
        new MenuRouteBehavior(
            new ShopsFactory(),
            {
                checks: [
                    componentReadyChecks.categories
                ],
                message: 'Please add categories before you define shops. Every shop may have it\'s own order for categories'
            }
        )
    ),
    new MenuRoute(
        new NamedIcon('Meals', '🥗'),
        new MenuRouteBehavior(
            new MealsFactory(),
            {
                checks: [
                    componentReadyChecks.itemsWithFood
                ],
                message: 'Please add at least one "food - item" to create meals'
            }
        )
    )
];

export default ApplicationMenuRoutes;
