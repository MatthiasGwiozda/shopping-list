import QueryExecutor from "../../../database/queryExecutor/QueryExecutor";

export default abstract class QueryExecutorDaoFactory {

    constructor(
        protected queryExecutor: QueryExecutor
    ) { }
}
