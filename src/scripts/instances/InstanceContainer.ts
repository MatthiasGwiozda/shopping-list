import MealCollectionFactory from "../components/mealCollection/MealCollectionFactory"
import DatabaseCreator from "../database/creator/DatabaseCreator"
import DatabaseInstanciator from "../database/creator/DatabaseInstanciator"
import { CategoryAccessObject, ItemAccessObject, MealAccessObject, ShopAccessObject, ShoppingListAccessObject } from "../database/dataAccessObjects/AccessObjects"
import CategoryDaoImpl from "../database/dataAccessObjects/category/CategoryDaoImpl"
import ItemDaoImpl from "../database/dataAccessObjects/item/ItemDaoImpl"
import ShopDaoImpl from "../database/dataAccessObjects/shop/ShopDaoImpl"
import Database from "../database/Database"
import QueryExecutorSqliteNode from "../database/queryExecutor/QueryExecutorSqliteNode"
import GoodsShopAssignementAdditionalActionFactory from "../factories/components/editableList/additionalAction/implementations/GoodsShopAssignementAdditionalActionFactory"
import MealIngredientsAdditionalActionFactory from "../factories/components/editableList/additionalAction/implementations/MealIngredientsAdditionalActionFactory"
import ItemCollectionFactory from "../factories/components/itemCollection/ItemCollectionFactory"
import CategoriesFactory from "../factories/components/menuComponents/implementations/CategoriesFactory"
import ItemsFactory from "../factories/components/menuComponents/implementations/ItemsFactory"
import MealsFactory from "../factories/components/menuComponents/implementations/MealsFactory"
import ShoppingListFactory from "../factories/components/menuComponents/implementations/ShoppingListFactory"
import ShopsFactory from "../factories/components/menuComponents/implementations/ShopsFactory"
import ShoppingListCollectionFactory from "../factories/components/shoppingListCollection/ShoppingListCollectionFactory"
import Menu from "../menu/Menu"
import CategoriesMenuRoute from "../menu/menuRouteCreators/implementations/CategoriesMenuRoute"
import ItemsMenuRoute from "../menu/menuRouteCreators/implementations/ItemsMenuRoute"
import MealsMenuRoute from "../menu/menuRouteCreators/implementations/MealsMenuRoute"
import ShoppingListMenuRoute from "../menu/menuRouteCreators/implementations/ShoppingListMenuRoute"
import ShopsMenuRoute from "../menu/menuRouteCreators/implementations/ShopsMenuRoute"
import MenuRouteCreator from "../menu/menuRouteCreators/MenuRouteCreator"
import ComponentReadyChecksImpl from "../menu/readyCheck/ComponentReadyChecksImpl"
import MenuRouteReadyChecker from "../menu/readyCheck/MenuRouteReadyChecker"

export default class InstanceContainer {

    queryExecutor: QueryExecutorSqliteNode;
    databaseInstanciator: DatabaseInstanciator
    categoryDao: CategoryDaoImpl;
    shopDao: ShopDaoImpl;
    itemDao: ItemDaoImpl;
    readyChecks: ComponentReadyChecksImpl;
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
    categoriesFactory: CategoriesFactory
    goodsShopAssignementAdditionalActionFactory: GoodsShopAssignementAdditionalActionFactory
    shopAccessObject: ShopAccessObject;
    categoryAccessObject: CategoryAccessObject;
    itemCollectionFactory: ItemCollectionFactory;
    itemAccessObject: ItemAccessObject;
    mealIngredientsAdditionalActionFactory: MealIngredientsAdditionalActionFactory
    shoppingListCollectionFactory: ShoppingListCollectionFactory
    mealCollectionFactory: MealCollectionFactory
    mealAccessObject: MealAccessObject;
    shoppingListAccessObject: ShoppingListAccessObject;

    constructor() {
        this.queryExecutor = new QueryExecutorSqliteNode()
        Database.injectDependencies(this);
        this.categoryAccessObject = Database;
        this.shopAccessObject = Database;
        this.itemAccessObject = Database;
        this.mealAccessObject = Database;
        this.shoppingListAccessObject = Database;

        this.databaseCreator = new DatabaseCreator(this);
        this.databaseInstanciator = new DatabaseInstanciator(this)
        this.categoryDao = new CategoryDaoImpl(this);
        this.shopDao = new ShopDaoImpl(this);
        this.itemDao = new ItemDaoImpl(this);
        this.readyChecks = new ComponentReadyChecksImpl(this);
        this.itemCollectionFactory = new ItemCollectionFactory(this);
        this.mealIngredientsAdditionalActionFactory = new MealIngredientsAdditionalActionFactory(this);
        this.mealsFactory = new MealsFactory(this);
        this.shopsFactory = new ShopsFactory(this);
        this.goodsShopAssignementAdditionalActionFactory =
            new GoodsShopAssignementAdditionalActionFactory(this)
        this.itemsFactory = new ItemsFactory(this);
        this.shoppingListCollectionFactory = new ShoppingListCollectionFactory(this);
        this.shoppingListFactory = new ShoppingListFactory(this);
        this.categoriesFactory = new CategoriesFactory(this);
        this.mealCollectionFactory = new MealCollectionFactory(this);

        this.shoppingListMenuRoute = new ShoppingListMenuRoute(this);
        this.itemsMenuRoute = new ItemsMenuRoute(this);
        this.categoriesMenuRoute = new CategoriesMenuRoute(this);
        this.shopsMenuRoute = new ShopsMenuRoute(this);
        this.mealsMenuRoute = new MealsMenuRoute(this);
        this.menuRouteCreators = [
            this.shoppingListMenuRoute,
            this.itemsMenuRoute,
            this.categoriesMenuRoute,
            this.shopsMenuRoute,
            this.mealsMenuRoute,
        ]
        this.menuRouteReadyChecker = new MenuRouteReadyChecker();
        this.menu = new Menu(this);
    }
}
