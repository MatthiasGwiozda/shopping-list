import * as sqlite3 from 'sqlite3';
import DatabaseCreatorFactorySqlite from '../../factories/database/DatabaseCreatorFactorySqlite';
import FileUtilities, { Files } from '../../utilities/FileUtilities';

export default class DatabaseInstanciator {

    private sqliteInstance: sqlite3.Database;

    async getInstance(): Promise<sqlite3.Database> {
        await this.createDatabaseIfNotExistent();
        this.setSqliteInstanceIfNotAlreadySet();
        return this.sqliteInstance;
    }

    private async createDatabaseIfNotExistent() {
        if (this.isDatabaseNotExistent()) {
            await this.createDatabase();
        }
    }

    private setSqliteInstanceIfNotAlreadySet(): void {
        if (this.sqliteInstance == null) {
            this.setSqliteInstance();
        }
    }

    private isDatabaseNotExistent() {
        return FileUtilities.getFileContent(Files.database) == null;
    }

    private async createDatabase() {
        this.setSqliteInstance();
        return new DatabaseCreatorFactorySqlite(this.sqliteInstance)
            .getDatabaseCreator()
            .createDatabase();
    }

    private setSqliteInstance() {
        const databasePath = FileUtilities.getFilePath(Files.database);
        this.sqliteInstance = new sqlite3.Database(databasePath);
    }
}
