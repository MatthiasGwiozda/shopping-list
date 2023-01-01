import QueryExecutor from "../queryExecutor/QueryExecutor";

export default abstract class QueryExecutorDao {

    constructor(
        protected queryExecutor: QueryExecutor
    ) { }
}
