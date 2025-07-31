import QueryExecutorSqliteNode from "../../scripts/database/queryExecutor/QueryExecutorSqliteNode";
import InstanceContainer from "../../scripts/instances/InstanceContainer";

export default class TestInstanceContainer {
    private instanceContainer: InstanceContainer;
    queryExecutorSqliteNode: QueryExecutorSqliteNode;

    constructor() {
        this.instanceContainer = new InstanceContainer();
        this.instanceContainer.createInstances();
        this.queryExecutorSqliteNode = this.instanceContainer.queryExecutor;
    }
}
