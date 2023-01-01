import QueryExecutor from "../../../database/queryExecutor/QueryExecutor";

export default interface QueryExecutorFactory {
    getQueryExecutor(): Promise<QueryExecutor>
}
