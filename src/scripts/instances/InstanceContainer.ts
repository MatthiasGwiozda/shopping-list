import DatabaseCreator from "../database/creator/DatabaseCreator"
import DatabaseInstanciator from "../database/creator/DatabaseInstanciator"
import CategoryDaoImpl from "../database/dataAccessObjects/category/CategoryDaoImpl"
import ItemDaoImpl from "../database/dataAccessObjects/item/ItemDaoImpl"
import ShopDaoImpl from "../database/dataAccessObjects/shop/ShopDaoImpl"
import Database from "../database/Database"
import QueryExecutorSqliteNode from "../database/queryExecutor/QueryExecutorSqliteNode"
import MenuRoutesFactory from "../factories/menu/MenuRoutesFactory"
import Menu from "../menu/Menu"
import ComponentReadyChecksImpl from "../menu/readyCheck/ComponentReadyChecksImpl"
import MenuRoute from "../menu/types/menuRoute/MenuRoute"

export default class InstanceContainer {

    queryExecutor: QueryExecutorSqliteNode;
    databaseInstanciator: DatabaseInstanciator
    categoryDao: CategoryDaoImpl;
    shopDao: ShopDaoImpl;
    itemDao: ItemDaoImpl;
    readyChecks: ComponentReadyChecksImpl;
    menuRoutes: MenuRoute[];
    menu: Menu;
    databaseCreator: DatabaseCreator

    constructor() {
        this.queryExecutor = new QueryExecutorSqliteNode()
        Database.injectQueryExecutor(this.queryExecutor);
        this.databaseCreator = new DatabaseCreator(this.queryExecutor);
        this.databaseInstanciator = new DatabaseInstanciator(this)
        this.categoryDao = new CategoryDaoImpl(this.queryExecutor);
        this.shopDao = new ShopDaoImpl(this.queryExecutor);
        this.itemDao = new ItemDaoImpl(this.queryExecutor);
        this.readyChecks = new ComponentReadyChecksImpl(
            this.categoryDao,
            this.shopDao,
            this.itemDao
        )
        this.menuRoutes = new MenuRoutesFactory(this.readyChecks).getRoutes()
        this.menu = new Menu(this.menuRoutes);
    }
}
