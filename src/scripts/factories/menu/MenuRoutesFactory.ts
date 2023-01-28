import ComponentReadyChecks from '../../menu/types/readyCheck/ComponentReadyChecks';
import MenuRoute from '../../menu/types/menuRoute/MenuRoute';
import ShoppingListMenuRoute from '../../menu/menuRouteCreators/implementations/ShoppingListMenuRoute';
import ItemsMenuRoute from '../../menu/menuRouteCreators/implementations/ItemsMenuRoute';
import CategoriesMenuRoute from '../../menu/menuRouteCreators/implementations/CategoriesMenuRoute';
import ShopsMenuRoute from '../../menu/menuRouteCreators/implementations/ShopsMenuRoute';
import MealsMenuRoute from '../../menu/menuRouteCreators/implementations/MealsMenuRoute';

export default class MenuRoutesFactory {

    constructor(
        private readyChecks: ComponentReadyChecks
    ) { }

    public getRoutes(): MenuRoute[] {
        return [
            new ShoppingListMenuRoute(this.readyChecks)
                .getMenuRoute(),
            new ItemsMenuRoute(this.readyChecks)
                .getMenuRoute(),
            new CategoriesMenuRoute()
                .getMenuRoute(),
            new ShopsMenuRoute(this.readyChecks)
                .getMenuRoute(),
            new MealsMenuRoute(this.readyChecks)
                .getMenuRoute()
        ]
    }
}
