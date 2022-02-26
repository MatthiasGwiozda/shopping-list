import * as sqlite3 from 'sqlite3';
import CategoriesShopOrder from '../types/CategoriesShopOrder';
import Category from '../types/Category';
import { CurrentItems } from '../types/components/itemCollection';
import GoodsShops from '../types/GoodsShops';
import Item from '../types/Item';
import Meal from '../types/Meal';
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
                        reject(err)
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
     * the shop - id is not visible to the "frontend" sometimes.
     * For example when creating new shops, the id is generated in the
     * database. Through this function you can get the current id of the shop.
     */
    private static async selectShopId(shop: Shop): Promise<number> {
        const res = await this.runQuery<{ shop_id: number }>(`
        SELECT shop_id
            FROM shops
                WHERE shop_name = ?
                AND postal_code = ?
                AND street = ?
                AND house_number = ?
        `, [shop.shop_name, shop.postal_code, shop.street, shop.house_number]);
        return res[0]?.shop_id;
    }

    static async selectGoodsCategoriesShopOrder(shop: Shop): Promise<CategoriesShopOrder[]> {
        const shopId = await this.selectShopId(shop);
        const categoriesShopOrder = await this.runQuery<CategoriesShopOrder>(`
        SELECT category, \`order\`
            FROM goods_categories_shop_order
                WHERE shop_id = ?
                    ORDER BY \`order\`;
        `, [shopId]);
        return categoriesShopOrder;
    }

    private static async moveCategoryShopOrderDown(fromCategory: string, toCategory: string, shopId: number): Promise<boolean> {
        try {
            await this.runQuery(`
            WITH shopId AS (
                SELECT ? AS id
            ), fromCategory AS (
                SELECT \`order\`, category
                    FROM goods_categories_shop_order
                        WHERE category = ?
                        AND shop_id = (SELECT id FROM shopId)
            ), toCategory AS (
                SELECT \`order\`
                    FROM goods_categories_shop_order
                        WHERE category = ?
                        AND shop_id = (SELECT id FROM shopId)
            )
            UPDATE goods_categories_shop_order
                SET \`order\` = 
                IIF(
                    category = (SELECT category FROM fromCategory),
                    (SELECT \`order\` - 1 FROM toCategory),
                    \`order\` - 1
                )
                    WHERE \`order\` BETWEEN (SELECT \`order\` FROM fromCategory) AND (SELECT \`order\` - 1 FROM toCategory)
                    AND shop_id = (SELECT id FROM shopId);
            
            `, [shopId, fromCategory, toCategory])
        } catch (e) {
            return false;
        }
        return true;
    }

    private static async moveCategoryShopOrderUp(fromCategory: string, toCategory: string, shopId: number): Promise<boolean> {
        try {

            /**
             * a query to get the order and category - name.
             * Parameters:
             * - category-name
             * - shop_id
             */
            const categoryShopOrderQuery = `
            SELECT \`order\`, category
                    FROM goods_categories_shop_order
                        WHERE category = ?
                        AND shop_id = ?
            `;
            /**
             * the toCategory - order must be pulled beforehand from the database.
             * The results of With - clauses in sqlite are updated for each row.
             * A single UPDATE - query, which selects the data itself, is therfore not sufficient.
             * When the order of the toCategory is updated before the
             * fromCategory - order, the orders of the fromCategory and
             * toCategory would be the same.
             */
            const [{ order: toCategoryOrder }] = await this.runQuery<CategoriesShopOrder>(
                categoryShopOrderQuery,
                [toCategory, shopId]
            );

            await this.runQuery(`
            WITH fromCategory AS (
                ${categoryShopOrderQuery}
            ), toCategory AS (
                ${categoryShopOrderQuery}
            )
            UPDATE goods_categories_shop_order
                SET \`order\` = 
                IIF(
                    category = (SELECT category FROM fromCategory),
                    ?,
                    \`order\` + 1
                )
                    WHERE \`order\` BETWEEN (SELECT \`order\` FROM toCategory) AND (SELECT \`order\` FROM fromCategory) 
                    AND shop_id = ?;

            `, [
                // fromCategory
                fromCategory, shopId,
                // toCategory
                toCategory, shopId,
                // IIF - block
                toCategoryOrder,
                // shopId
                shopId
            ]);

        } catch (e) {
            return false;
        }
        return true;
    }

    private static async getOrderOfCategory(category: string, shop: Shop): Promise<number> {
        const categories = await this.selectGoodsCategoriesShopOrder(shop);
        return categories.find(
            (c) => c.category == category
        ).order;
    }

    /**
     * moves the "fromCategory" to the top of "toCategory".
     */
    static async moveCategoryShopOrder(fromCategory: string, toCategory: string, shop: Shop): Promise<boolean> {
        const fromOrder = await this.getOrderOfCategory(fromCategory, shop);
        const toOrder = await this.getOrderOfCategory(toCategory, shop);
        const shopId = await this.selectShopId(shop);
        if (fromOrder > toOrder) {
            return await this.moveCategoryShopOrderUp(fromCategory, toCategory, shopId);
        } else {
            return await this.moveCategoryShopOrderDown(fromCategory, toCategory, shopId);
        }
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

    private static async assignAllItemsToNewShop(shop: Shop) {
        await this.runQuery(`
        INSERT INTO goods_shops(name, shop_id)
            SELECT name, ?
                FROM goods;
        `, [await this.selectShopId(shop)])
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
        await this.assignAllItemsToNewShop(shop);
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

    static async selectAllItems(): Promise<Item[]> {
        const items: Item[] = await Database.runQuery(`
        SELECT goods.name, goods.category, food.name IS NOT NULL AS food
            FROM goods
                LEFT JOIN food ON food.name = goods.name;
        `);
        return items.map(item => {
            /**
             * food should be a boolean in the application - context.
             */
            return { ...item, food: !!item.food }
        })
    }

    static async deleteItem(item: Item): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM goods
	            WHERE name = ?;
            `, [item.name]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async setItemAsFood(item: Item) {
        await this.runQuery(`
        INSERT INTO food (name)
            VALUES (?);
        `, [item.name]);
    }

    private static async assignAllShopsToNewItem(item: Item) {
        await this.runQuery(`
        INSERT INTO goods_shops (name, shop_id)
            SELECT ?, shop_id
                FROM shops;
        `, [item.name]);
    }

    static async insertItem(item: Item): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO goods (name, category)
	            VALUES (?, ?);
            `, [item.name, item.category]);

            if (item.food) {
                await this.setItemAsFood(item);
            }
        } catch (e) {
            return false;
        }
        await this.assignAllShopsToNewItem(item);
        return true;
    }

    static async updateItem(oldItem: Item, newItem: Item) {
        try {
            await this.runQuery(`
            UPDATE goods
                SET name = ?,
                category = ?
                    WHERE name = ?;
            `, [newItem.name, newItem.category, oldItem.name]);

            if (newItem.food && !oldItem.food) {
                await this.setItemAsFood(newItem);
            }

            if (!newItem.food) {
                await this.runQuery(`
                DELETE FROM food
	                WHERE name = ?;
                `, [newItem.name]);
            }

        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectGoodsShops(): Promise<GoodsShops[]> {
        return await this.runQuery(`
        SELECT *
            FROM goods_shops
        `)
    }

    static async addShopToItem(shop: Shop, item: Item): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO goods_shops (name, shop_id)
	            VALUES (?, ?);
            `, [
                item.name,
                await this.selectShopId(shop)
            ]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async removeShopFromItem(shop: Shop, item: Item): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM goods_shops 
                WHERE name = ?
                AND shop_id = ?;
            `, [
                item.name,
                await this.selectShopId(shop)
            ]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectAllMeals(): Promise<Meal[]> {
        const meals: Meal[] = await Database.runQuery(`
        SELECT meals.name, recipe, meals_components.name IS NOT NULL AS component
            FROM meals
                LEFT JOIN meals_components
                ON meals_components.name = meals.name;
        `);
        return meals.map(meal => {
            /**
             * component should be a boolean in the application - context.
             */
            return { ...meal, component: !!meal.component }
        })
    }

    static async deleteMeal(meal: Meal): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM meals
                WHERE name = ?;
            `, [meal.name]);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Sets the "component" - state to a meal.
     * @param isComponent you can remove the component - state from a meal
     * by setting this paramter to false. When this parameter is set to true,
     * the meal will be set as a component.
     */
    static async setMealComponent(meal: Meal, isComponent: boolean) {
        let query: string;
        if (!isComponent) {
            query = `
            DELETE FROM meals_components
                WHERE name = ?;
            `;
        } else {
            query = `
            INSERT INTO meals_components(name)
                VALUES (?);
            `;
            // when switching to a component, remove all the assigned meal components
            await this.runQuery(`
            DELETE FROM meals_related_component
                WHERE meal = ?;
            `, [meal.name]);
        }
        await this.runQuery(query, [meal.name]);
    }

    static async insertMeal(meal: Meal): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO meals (name, recipe)
	            VALUES (?, ?);
            `, [meal.name, meal.recipe]);

            if (meal.component) {
                this.setMealComponent(meal, true);
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateMeal(oldMeal: Meal, newMeal: Meal) {
        try {
            await this.runQuery(`
            UPDATE meals
                SET name = ?,
                recipe = ?
                    WHERE name = ?;
            `, [newMeal.name, newMeal.recipe, oldMeal.name]);

            if (oldMeal.component && !newMeal.component) {
                this.setMealComponent(newMeal, false);
            } else if (!oldMeal.component && newMeal.component) {
                this.setMealComponent(newMeal, true);
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectMealFood(mealName: string): Promise<CurrentItems[]> {
        return await this.runQuery(`
            SELECT food AS itemName, quantity
                FROM meals_food
                    WHERE meal = ?
            `, [mealName]);
    }

    static async insertMealFood(mealName: string, foodName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO meals_food (meal, food) 
                VALUES (?, ?);
                `, [mealName, foodName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async deleteMealFood(mealName: string, foodName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM meals_food 
                WHERE meal = ?
                AND food = ?
                `, [mealName, foodName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateMealFoodQuantity(mealName: string, foodName: string, quantity: number): Promise<boolean> {
        try {
            await this.runQuery(`
            UPDATE meals_food 
                SET quantity = ?
                    WHERE meal = ?
                    AND food = ?
                `, [quantity, mealName, foodName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * @returns all the names of the related meal components for the given meal.
     */
    static async selectRelatedMealComponents(mealName: string): Promise<string[]> {
        const relatedMeals = await this.runQuery<{ related_meal: string }>(`
        SELECT related_meal
            FROM meals_related_component
                WHERE meal = ?
            `, [mealName]);
        return relatedMeals.map(meal => meal.related_meal);
    }

    static async setRelatedMealComponent(mealName: string, componentMealName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO meals_related_component (meal, related_meal)
                VALUES (?, ?);
                `, [mealName, componentMealName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async deleteRelatedMealComponent(mealName: string, componentMealName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM meals_related_component
                WHERE meal = ?
                AND related_meal = ?
                `, [mealName, componentMealName]);
        } catch (e) {
            return false;
        }
        return true;
    }
}
