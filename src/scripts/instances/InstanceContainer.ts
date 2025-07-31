import CategoryDaoImpl from "../database/dataAccessObjects/category/CategoryDaoImpl"
import ItemDaoImpl from "../database/dataAccessObjects/item/ItemDaoImpl"
import ShopDaoImpl from "../database/dataAccessObjects/shop/ShopDaoImpl"
import QueryExecutorSqliteNode from "../database/queryExecutor/QueryExecutorSqliteNode"
import MenuRoutesFactory from "../factories/menu/MenuRoutesFactory"
import Menu from "../menu/Menu"
import ComponentReadyChecksImpl from "../menu/readyCheck/ComponentReadyChecksImpl"
import MenuRoute from "../menu/types/menuRoute/MenuRoute"

export default class InstanceContainer {

    queryExecutorSqliteNode: QueryExecutorSqliteNode;
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
        this.queryExecutorSqliteNode = new QueryExecutorSqliteNode()
    }

    private instanciateDaos() {
        this.categoryDao = new CategoryDaoImpl(this.queryExecutorSqliteNode);
        this.shopDao = new ShopDaoImpl(this.queryExecutorSqliteNode);
        this.itemDao = new ItemDaoImpl(this.queryExecutorSqliteNode);
    }

    private instanciateReadyChecks() {
        this.readyChecks = new ComponentReadyChecksImpl(
            this.categoryDao,
            this.shopDao,
            this.itemDao
        )
    }

    private instanciateMenuRoutes() {
        this.menuRoutes = new MenuRoutesFactory(this.readyChecks).getRoutes()
    }

    private instanciateMenu() {
        this.menu = new Menu(this.menuRoutes);
    }
}
