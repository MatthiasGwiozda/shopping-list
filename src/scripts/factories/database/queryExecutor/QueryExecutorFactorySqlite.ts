import DatabaseInstanciator from "../../../database/creator/DatabaseInstanciator";
import QueryExecutorSqlite from "../../../database/queryExecutor/QueryExecutorSqlite";
import QueryExecutorFactory from "./QueryExecutorFactory";

export default class QueryExecutorFactorySqlite implements QueryExecutorFactory {

    async getQueryExecutor(): Promise<QueryExecutorSqlite> {
        const sqliteDatabase = await this.getSqliteDatabase()
        return new QueryExecutorSqlite(sqliteDatabase)
    }

    private getSqliteDatabase() {
        return new DatabaseInstanciator()
            .getInstance();
    }
}
