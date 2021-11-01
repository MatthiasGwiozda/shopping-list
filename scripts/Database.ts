import * as sqlite3 from 'sqlite3';
import FileUtilities, { Files } from './utilities/FileUtilities';

export default class Database {

    private static db: sqlite3.Database;

    private static getDatabaseStructure(): string[] {
        const allQueries = FileUtilities.getFileContent(Files.structureSql);
        return allQueries
            .split(';')
            .filter(query => query != '');
    }

    private static runQuery<T>(query): Promise<T[]> {
        return new Promise(function (resolve) {
            Database.db.serialize(function () {
                Database.db.all(query, (err, rows) => {
                    resolve(rows);
                });
            });
        });
    }

    /**
     * initializes the database with the structure if
     * there was no database - file found.
     * Additionally instanciates the sqlite3 Database - instance.
     */
    static async initializeDatabase() {
        const databaseMissing = FileUtilities.getFileContent(Files.database) == null;
        Database.db = new sqlite3.Database(Files.database);
        if (databaseMissing) {
            const structureSql = Database.getDatabaseStructure();
            for (let singleQuery of structureSql) {
                await Database.runQuery(singleQuery);
            }
        }
    }
}
