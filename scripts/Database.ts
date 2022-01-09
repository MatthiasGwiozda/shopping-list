import * as sqlite3 from 'sqlite3';
import Category from '../types/Category';
import Shop from '../types/Shop';
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

    private static async assignAllShopsToNewCategory(categoryObject: Category): Promise<void> {
        await this.runQuery(`
        INSERT INTO goods_categories_shop_order (shop_id, category, \`order\`)
            SELECT shops.shop_id, ? AS category, COALESCE(orders.next, 1) AS 'order'
            FROM shops
                LEFT JOIN (
                    SELECT max(\`order\`) + 1 AS next, shop_id
                        FROM goods_categories_shop_order
                            GROUP BY shop_id
                ) AS orders
                ON shops.shop_id = orders.shop_id;
            `, [categoryObject.category]);
    }

    /**
     * creates a new category. Additionally adds the categories
     * to all shops in the goods_categories_shop_order - table.
     */
    static async insertCategory(categoryObject: Category): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO goods_categories (category)
                VALUES (?)
            `, [categoryObject.category]);
        } catch (e) {
            return false;
        }
        /**
         * possible optimization for the future: inserting new categories
         * could be a transaction together with assigning the categories
         * to all the shops. Either both queries succeed or both fail.
         */
        await this.assignAllShopsToNewCategory(categoryObject);
        return true;
    }

    static async updateCategory(oldCategory: Category, newCategory: Category) {
        try {
            await this.runQuery(`
            UPDATE goods_categories
                SET category = ?
                    WHERE category = ?
            `, [newCategory.category, oldCategory.category]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectAllShops(): Promise<Shop[]> {
        return await Database.runQuery(`
        SELECT shop_name, street, house_number, postal_code, shop_id
            FROM shops;
        `);
    }

    static async deleteShop(shop: Shop): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM shops
                WHERE house_number = ?
                AND postal_code = ?
                AND shop_name = ?
                AND street = ?
            `, [shop.house_number, shop.postal_code, shop.shop_name, shop.street]);
        } catch (e) {
            return false;
        }
        return true;
    }

    private static async assignAllCategoriesToNewShop(shop: Shop) {
        await this.runQuery(`
        INSERT INTO goods_categories_shop_order (shop_id, category, \`order\`)
            SELECT 
            (SELECT shop_id
                FROM shops
                    WHERE 
                    house_number = ?
                    AND postal_code = ?
                    AND shop_name = ?
                    AND street = ?) AS shop_id,
            category,
            rowid AS 'order'
                FROM goods_categories;
            `, [shop.house_number, shop.postal_code, shop.shop_name, shop.street]);
    }

    /**
     * creates a new shop.
     * Additionaly assignes all the current categories to this new shop.
     */
    static async insertShop(shop: Shop): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO shops (house_number, postal_code, shop_name, street)
                VALUES (?, ?, ?, ?)
            `, [shop.house_number, shop.postal_code, shop.shop_name, shop.street]);
        } catch (e) {
            return false;
        }
        await this.assignAllCategoriesToNewShop(shop);
        return true;
    }

    static async updateShop(oldShop: Shop, newShop: Shop) {
        try {
            await this.runQuery(`
            UPDATE shops
                SET house_number = ?,
                postal_code = ?,
                shop_name = ?,
                street = ?
                    WHERE house_number = ?
                    AND postal_code = ?
                    AND shop_name = ?
                    AND street = ?
            `, [
                newShop.house_number, newShop.postal_code, newShop.shop_name, newShop.street,
                oldShop.house_number, oldShop.postal_code, oldShop.shop_name, oldShop.street,
            ]);
        } catch (e) {
            return false;
        }
        return true;
    }
}
