import FileUtilities, { Files } from "../../utilities/FileUtilities";
import QueryExecutor from "./QueryExecutor";
import { DatabaseSync } from "node:sqlite";

export default class QueryExecutorSqliteNode implements QueryExecutor {

    async runQuery<T>(query: string, params: any[] = []): Promise<T[]> {
        const databasePath = FileUtilities.getFilePath(Files.database)
        const database = new DatabaseSync(databasePath)
        const preparedQuery = database.prepare(query);
        const paramsForSqlite = this.getParamsForSqlite(params);
        const result = preparedQuery.all({}, ...paramsForSqlite);
        return result as T[]
    }

    private getParamsForSqlite(params: any[]): any[] {
        return params.map(param => {
            if (typeof param === "boolean") {
                return param ? 1 : 0;
            }
            return param;
        })
    }
}
