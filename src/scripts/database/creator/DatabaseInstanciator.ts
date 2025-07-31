import DatabaseCreatorFactorySqlite from '../../factories/database/DatabaseCreatorFactorySqlite';
import FileUtilities, { Files } from '../../utilities/FileUtilities';
import QueryExecutor from '../queryExecutor/QueryExecutor';

export interface DatabaseInstanciatorDeps {
    queryExecutor: QueryExecutor;
}

export default class DatabaseInstanciator {

    constructor(private deps: DatabaseInstanciatorDeps) { }

    async createDatabaseIfNotExistent() {
        if (this.isDatabaseNotExistent()) {
            await this.createDatabase();
        }
    }

    private isDatabaseNotExistent() {
        return FileUtilities.getFileContent(Files.database) == null;
    }

    private async createDatabase() {
        return new DatabaseCreatorFactorySqlite(this.deps.queryExecutor)
            .getDatabaseCreator()
            .createDatabase();
    }
}
