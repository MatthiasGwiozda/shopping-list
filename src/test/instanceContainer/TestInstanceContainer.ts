import Database from "../../scripts/database/Database";
import QueryExecutorSqliteNode from "../../scripts/database/queryExecutor/QueryExecutorSqliteNode";
import InstanceContainer from "../../scripts/instances/InstanceContainer";

export default class TestInstanceContainer {
    private instanceContainer: InstanceContainer;
    queryExecutorSqliteNode: QueryExecutorSqliteNode;
    database: Database;

    constructor() {
        this.instanceContainer = new InstanceContainer();
        this.queryExecutorSqliteNode = this.instanceContainer.queryExecutor;
        this.database = this.instanceContainer.database;
    }
}
