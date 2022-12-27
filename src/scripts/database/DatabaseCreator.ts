import FileUtilities, { Files } from "../utilities/FileUtilities";
import QueryExecutor from "./queryExecutor/QueryExecutor";

export default class DatabaseCreator {

    constructor(
        private queryExecutor: QueryExecutor
    ) { }

    public async createDatabaseIfNotExistent(): Promise<void> {
        if (this.isDatabaseMissing()) {
            await this.createDatabase();
        }
    }

    private isDatabaseMissing() {
        return FileUtilities.getFileContent(Files.database) == null;
    }

    private async createDatabase() {
        const structureSql = this.getDatabaseStructure();
        for (let singleQuery of structureSql) {
            await this.queryExecutor.runQuery(singleQuery);
        }
    }

    private getDatabaseStructure(): string[] {
        const allQueries = FileUtilities.getFileContent(Files.structureSql);
        return allQueries
            .split(';')
            .filter(query => query != '' && query != '\r\n' && query != '\n');
    }
}
