import FileUtilities, { Files } from "../../utilities/FileUtilities";
import QueryExecutorUser from "../queryExecutor/QueryExecutorUser";

export default class DatabaseCreator extends QueryExecutorUser {

    public async createDatabase() {
        for (let structureStatement of this.getStructureStatements()) {
            await this.queryExecutor.runQuery(structureStatement);
        }
    }

    private getStructureStatements(): string[] {
        const allQueries = FileUtilities.getFileContent(Files.structureSql);
        return allQueries
            .split(';')
            .filter(query => query != '' && query != '\r\n' && query != '\n');
    }
}
