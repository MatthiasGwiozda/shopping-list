import CategoryDaoImpl from "../database/dataAccessObjects/category/CategoryDaoImpl"
import ItemDaoImpl from "../database/dataAccessObjects/item/ItemDaoImpl"
import ShopDaoImpl from "../database/dataAccessObjects/shop/ShopDaoImpl"
import QueryExecutorSqlite from "../database/queryExecutor/QueryExecutorSqlite"
import CategoryDaoFactoryImpl from "../factories/database/dataAccessObjects/category/CategoryDaoFactoryImpl"
import ItemDaoFactoryImpl from "../factories/database/dataAccessObjects/item/ItemDaoFactoryImpl"
import ShopDaoFactoryImpl from "../factories/database/dataAccessObjects/shop/ShopDaoFactoryImpl"
import QueryExecutorFactorySqlite from "../factories/database/queryExecutor/QueryExecutorFactorySqlite"
import ComponentReadyChecksFactoryImpl from "../factories/menu/componentReadyChecks/ComponentReadyChecksFactoryImpl"
import MenuFactory from "../factories/menu/MenuFactory"
import MenuRoutesFactory from "../factories/menu/MenuRoutesFactory"
import Menu from "../menu/Menu"
import ComponentReadyChecksImpl from "../menu/readyCheck/ComponentReadyChecksImpl"
import MenuRoute from "../menu/types/menuRoute/MenuRoute"

export default class InstanceContainer {

    private queryExecutor: QueryExecutorSqlite;
    private categoryDao: CategoryDaoImpl;
    private shopDao: ShopDaoImpl;
    private itemDao: ItemDaoImpl;
    private readyChecks: ComponentReadyChecksImpl;
    private menuRoutes: MenuRoute[];
    private menu: Menu;

    public async createInstances() {
        await this.instanciateQueryExecutor()
        this.instanciateDaos()
        this.instanciateReadyChecks()
        this.instanciateMenuRoutes()
        this.instanciateMenu()
    }

    public getMenu(): Menu {
        return this.menu;
    }

    private async instanciateQueryExecutor() {
        this.queryExecutor = await new QueryExecutorFactorySqlite().getQueryExecutor()
    }

    private instanciateDaos() {
        this.categoryDao = new CategoryDaoFactoryImpl(this.queryExecutor)
            .getDao();
        this.shopDao = new ShopDaoFactoryImpl(this.queryExecutor)
            .getDao();
        this.itemDao = new ItemDaoFactoryImpl(this.queryExecutor)
            .getDao();
    }

    private instanciateReadyChecks() {
        this.readyChecks = new ComponentReadyChecksFactoryImpl(
            this.categoryDao,
            this.shopDao,
            this.itemDao
        ).getReadyChecks()
    }

    private instanciateMenuRoutes() {
        this.menuRoutes = new MenuRoutesFactory(this.readyChecks).getRoutes()
    }

    private instanciateMenu() {
        const menuFactory = new MenuFactory(this.menuRoutes)
        this.menu = menuFactory.getMenu()
    }
}
