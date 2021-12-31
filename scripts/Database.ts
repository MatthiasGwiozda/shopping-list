import * as sqlite3 from 'sqlite3';
import Category from '../types/Category';
import FileUtilities, { Files } from './utilities/FileUtilities';

export default class Database {

    private static db: sqlite3.Database;

    private static getDatabaseStructure(): string[] {
        const allQueries = FileUtilities.getFileContent(Files.structureSql);
        return allQueries
            .split(';')
            .filter(query => query != '');
    }

    private static runQuery<T>(query, params: any[] = []): Promise<T[]> {
        return new Promise(function (resolve, reject) {
            Database.db.serialize(function () {
                Database.db.all(query, params, (err, rows) => {
                    if (err != null) {
                        reject()
                    } else {
                        resolve(rows);
                    }
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
        /**
         * for some insane reason foreign key checks are not enabled by default in the
         * sqlite3 - package.
         * @see https://github.com/mapbox/node-sqlite3/issues/896#issuecomment-337873296
         */
        await this.runQuery("PRAGMA foreign_keys = ON");
        if (databaseMissing) {
            const structureSql = Database.getDatabaseStructure();
            for (let singleQuery of structureSql) {
                await Database.runQuery(singleQuery);
            }
        }
    }

    static async selectAllCategories(): Promise<Category[]> {
        return await Database.runQuery(`
        SELECT *
            FROM goods_categories;
        `);
    }

    static async deleteCategory(categoryObject: Category): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM goods_categories
                WHERE category = ?
            `, [categoryObject.category]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async insertCategory(categoryObject: Category): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO goods_categories (category)
                VALUES (?)
            `, [categoryObject.category]);
        } catch (e) {
            return false;
        }
        return true;
    }
}
