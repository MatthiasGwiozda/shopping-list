import DatabaseCreator from "../database/creator/DatabaseCreator"
import DatabaseInstanciator from "../database/creator/DatabaseInstanciator"
import CategoryDaoImpl from "../database/dataAccessObjects/category/CategoryDaoImpl"
import ItemDaoImpl from "../database/dataAccessObjects/item/ItemDaoImpl"
import ShopDaoImpl from "../database/dataAccessObjects/shop/ShopDaoImpl"
import Database from "../database/Database"
import QueryExecutorSqliteNode from "../database/queryExecutor/QueryExecutorSqliteNode"
import ItemsFactory from "../factories/components/menuComponents/implementations/ItemsFactory"
import MealsFactory from "../factories/components/menuComponents/implementations/MealsFactory"
import ShoppingListFactory from "../factories/components/menuComponents/implementations/ShoppingListFactory"
import ShopsFactory from "../factories/components/menuComponents/implementations/ShopsFactory"
import Menu from "../menu/Menu"
import CategoriesMenuRoute from "../menu/menuRouteCreators/implementations/CategoriesMenuRoute"
import ItemsMenuRoute from "../menu/menuRouteCreators/implementations/ItemsMenuRoute"
import MealsMenuRoute from "../menu/menuRouteCreators/implementations/MealsMenuRoute"
import ShoppingListMenuRoute from "../menu/menuRouteCreators/implementations/ShoppingListMenuRoute"
import ShopsMenuRoute from "../menu/menuRouteCreators/implementations/ShopsMenuRoute"
import MenuRouteCreator from "../menu/menuRouteCreators/MenuRouteCreator"
import ComponentReadyChecksImpl from "../menu/readyCheck/ComponentReadyChecksImpl"
import MenuRouteReadyChecker from "../menu/readyCheck/MenuRouteReadyChecker"
import MenuRoute from "../menu/types/menuRoute/MenuRoute"

export default class InstanceContainer {

    queryExecutor: QueryExecutorSqliteNode;
    databaseInstanciator: DatabaseInstanciator
    categoryDaoImpl: CategoryDaoImpl;
    shopDaoImpl: ShopDaoImpl;
    itemDaoImpl: ItemDaoImpl;
    readyChecks: ComponentReadyChecksImpl;
    menuRoutes: MenuRoute[];
    menu: Menu;
    databaseCreator: DatabaseCreator
    shoppingListMenuRoute: ShoppingListMenuRoute
    itemsMenuRoute: ItemsMenuRoute
    categoriesMenuRoute: CategoriesMenuRoute
    shopsMenuRoute: ShopsMenuRoute
    mealsMenuRoute: MealsMenuRoute
    menuRouteCreators: MenuRouteCreator[];
    menuRouteReadyChecker: MenuRouteReadyChecker
    mealsFactory: MealsFactory
    shopsFactory: ShopsFactory
    itemsFactory: ItemsFactory
    shoppingListFactory: ShoppingListFactory

    constructor() {
        this.queryExecutor = new QueryExecutorSqliteNode()
        Database.injectDependencies(this);
        this.databaseCreator = new DatabaseCreator(this.queryExecutor);
        this.databaseInstanciator = new DatabaseInstanciator(this)
        this.categoryDaoImpl = new CategoryDaoImpl(this.queryExecutor);
        this.shopDaoImpl = new ShopDaoImpl(this.queryExecutor);
        this.itemDaoImpl = new ItemDaoImpl(this.queryExecutor);
        this.readyChecks = new ComponentReadyChecksImpl(
            this.categoryDaoImpl,
            this.shopDaoImpl,
            this.itemDaoImpl
        )
        this.mealsFactory = new MealsFactory();
        this.shopsFactory = new ShopsFactory();
        this.itemsFactory = new ItemsFactory();
        this.shoppingListFactory = new ShoppingListFactory();

        this.shoppingListMenuRoute = new ShoppingListMenuRoute(this);
        this.itemsMenuRoute = new ItemsMenuRoute(this);
        this.categoriesMenuRoute = new CategoriesMenuRoute();
        this.shopsMenuRoute = new ShopsMenuRoute(this);
        this.mealsMenuRoute = new MealsMenuRoute(this);
        this.menuRouteCreators = [
            this.shoppingListMenuRoute,
            this.itemsMenuRoute,
            this.categoriesMenuRoute,
            this.shopsMenuRoute,
            this.mealsMenuRoute,
        ]
        this.menuRoutes = this.menuRouteCreators.map(creator => creator.getMenuRoute());
        this.menuRouteReadyChecker = new MenuRouteReadyChecker();
        this.menu = new Menu(this);
    }
}
