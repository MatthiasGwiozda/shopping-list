import DatabaseCreator from "../../database/DatabaseCreator";
import QueryExecutorSqlite from "../../database/queryExecutor/QueryExecutorSqlite";
import * as sqlite3 from 'sqlite3';

export default class DatabaseCreatorFactorySqlite {

    constructor(
        private sqliteDatabase: sqlite3.Database
    ) { }

    getDatabaseCreator(): DatabaseCreator {
        const queryExecutor = new QueryExecutorSqlite(this.sqliteDatabase);
        return new DatabaseCreator(queryExecutor);
    }
}
