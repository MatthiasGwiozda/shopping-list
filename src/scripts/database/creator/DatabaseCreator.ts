import FileUtilities, { Files } from "../../utilities/FileUtilities";
import QueryExecutor from "../queryExecutor/QueryExecutor";

interface Deps {
    queryExecutor: QueryExecutor;
}

export default class DatabaseCreator {

    constructor(private deps: Deps) { }

    public async createDatabase() {
        for (let structureStatement of this.getStructureStatements()) {
            await this.deps.queryExecutor.runQuery(structureStatement);
        }
    }

    private getStructureStatements(): string[] {
        const allQueries = FileUtilities.getFileContent(Files.structureSql);
        return allQueries
            .split(';')
            .filter(query => query != '' && query != '\r\n' && query != '\n');
    }
}
