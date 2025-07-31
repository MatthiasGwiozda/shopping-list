import FileUtilities, { Files } from "../../utilities/FileUtilities";
import QueryExecutor from "./QueryExecutor";
import { DatabaseSync } from "node:sqlite";

export default class QueryExecutorSqliteNode implements QueryExecutor {

    async runQuery<T>(query: string, params: any[] = []): Promise<T[]> {
        const databasePath = FileUtilities.getFilePath(Files.database)
        const database = new DatabaseSync(databasePath)
        const preparedQuery = database.prepare(query);
        const result = preparedQuery.all({}, ...params);
        return result as T[]
    }
}
