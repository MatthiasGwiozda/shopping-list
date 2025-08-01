import FileUtilities, { Files } from '../../utilities/FileUtilities';
import DatabaseCreator from './DatabaseCreator';

export interface DatabaseInstanciatorDeps {
    databaseCreator: DatabaseCreator;
}

export default class DatabaseInstanciator {

    constructor(private deps: DatabaseInstanciatorDeps) { }

    async createDatabaseIfNotExistent() {
        if (this.isDatabaseNotExistent()) {
            await this.deps.databaseCreator.createDatabase();
        }
    }

    private isDatabaseNotExistent() {
        return FileUtilities.getFileContent(Files.database) == null;
    }
}
