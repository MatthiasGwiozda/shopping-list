import DatabaseCreator from "../../database/creator/DatabaseCreator";
import QueryExecutor from "../../database/queryExecutor/QueryExecutor";

export default class DatabaseCreatorFactorySqlite {

    constructor(
        private queryExecutor: QueryExecutor,
    ) { }

    getDatabaseCreator(): DatabaseCreator {
        return new DatabaseCreator(this.queryExecutor);
    }
}
