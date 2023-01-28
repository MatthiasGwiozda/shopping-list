import QueryExecutor from "./QueryExecutor";

export default abstract class QueryExecutorUser {

    constructor(
        protected queryExecutor: QueryExecutor
    ) { }
}
