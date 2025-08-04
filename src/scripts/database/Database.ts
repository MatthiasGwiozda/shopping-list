import CategoriesShopOrder from '../types/CategoriesShopOrder';
import Category from '../types/Category';
import { CurrentItems } from '../types/components/itemCollection';
import GoodsShops from '../types/GoodsShops';
import Item from '../types/Item';
import Meal, { MealWithoutComponent } from '../types/Meal';
import MealInformation from '../types/MealInformation';
import Shop from '../types/Shop';
import ShoppingListItem from '../types/ShoppingListItem';
import ShoppingListMeal from '../types/ShoppingListMeal';
import CategoryDao from './dataAccessObjects/category/CategoryDao';
import ItemDao from './dataAccessObjects/item/ItemDao';
import ShopDao from './dataAccessObjects/shop/ShopDao';
import QueryExecutor from './queryExecutor/QueryExecutor';

interface DatabaseDeps {
    queryExecutor: QueryExecutor;
    categoryDao: CategoryDao;
    shopDao: ShopDao;
    itemDao: ItemDao;
}

/**
 * @deprecated use DataAccessObjects instead
 */
export default class Database {

    private static deps: DatabaseDeps;

    private static runQuery<T>(query, params: any[] = []): Promise<T[]> {
        return this.deps.queryExecutor
            .runQuery(query, params);
    }

    static injectDependencies(deps: DatabaseDeps) {
        this.deps = deps;
    }

    static async selectAllCategories(): Promise<Category[]> {
        return this.deps.categoryDao.selectAllCategories();
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

    static async updateCategory(oldCategory: Category, newCategory: Category): Promise<boolean> {
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
        return this.deps.shopDao.selectAllShops();
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

    static async updateShop(oldShop: Shop, newShop: Shop): Promise<boolean> {
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
        return this.deps.itemDao.selectAllItems();
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

    static async updateItem(oldItem: Item, newItem: Item): Promise<boolean> {
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
                ON meals_components.name = meals.name
                    ORDER BY meals.name;
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

    /**
     * @param updateRecipe when set to false, this function will not update the recipe
     * of the meal.
     */
    static async updateMeal(oldMeal: Meal, newMeal: Meal, updateRecipe = true): Promise<boolean> {
        try {
            if (updateRecipe) {
                await this.runQuery(`
                UPDATE meals
                    SET name = ?,
                    recipe = ?
                        WHERE name = ?;
                `, [newMeal.name, newMeal.recipe, oldMeal.name]);
            } else {
                await this.runQuery(`
                UPDATE meals
                    SET name = ?
                        WHERE name = ?;
                `, [newMeal.name, oldMeal.name]);
            }
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

    static async selectMealsInformation(): Promise<MealInformation[]> {
        const mealInformation = await this.runQuery<MealInformation>(`
            SELECT *, hasRelatedMeals | hasMealsFood AS useableMeal
                FROM v_meals
            `);
        return mealInformation.map(mealInfo => {
            return {
                name: mealInfo.name,
                recipe: mealInfo.recipe,
                hasMealsFood: !!mealInfo.hasMealsFood,
                hasRelatedMeals: !!mealInfo.hasRelatedMeals,
                useableMeal: !!mealInfo.useableMeal
            }
        })
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
     * @returns all the names of the related meal components for the given non component meal.
     */
    static async selectRelatedMealComponents(mealName: string): Promise<string[]> {
        const relatedMeals = await this.runQuery<{ related_meal: string }>(`
        SELECT related_meal
            FROM meals_related_component
                WHERE meal = ?
            `, [mealName]);
        return relatedMeals.map(meal => meal.related_meal);
    }

    /**
     * @returns all the meals, which are related to the given
     * componentMealName.
     */
    static async selectMealsForComponentMeal(componentMealName: string): Promise<string[]> {
        const relatedMeals = await this.runQuery<{ meal: string }>(`
        SELECT meal
            FROM meals_related_component
                WHERE related_meal = ?
            `, [componentMealName]);
        return relatedMeals.map(mealInfo => mealInfo.meal);
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

    static async insertMealToShoppingList(mealName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO shopping_lists_meals (meal)
                VALUES (?);
                `, [mealName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async deleteMealFromShoppingList(mealName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM shopping_lists_meals 
                WHERE meal = ?;
                `, [mealName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateMealShoppingListQuantity(mealName: string, quantity: number): Promise<boolean> {
        try {
            await this.runQuery(`
            UPDATE shopping_lists_meals 
                SET quantity = ?
                    WHERE meal = ?;
                `, [quantity, mealName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectAllMealShoppingList(): Promise<ShoppingListMeal[]> {
        return this.runQuery(`
            SELECT meal, quantity
                FROM shopping_lists_meals;
            `);
    }

    static async selectAllShoppingLists(): Promise<ShoppingListItem[]> {
        const shoppingLists = await this.runQuery<ShoppingListItem>(`
            SELECT shoppingListName, active
                FROM shopping_lists;
            `);
        return shoppingLists.map(list => {
            return {
                // boolean values are stored as integers in the database
                active: !!list.active,
                shoppingListName: list.shoppingListName
            }
        })
    }

    static async insertShoppingList(shoppingListName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO shopping_lists (shoppingListName)
                VALUES (?);
            `, [shoppingListName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateShoppingListActiveState(shoppingListName: string, active: boolean): Promise<boolean> {
        try {
            await this.runQuery(`
            UPDATE shopping_lists
                SET active = ?
                    WHERE shoppingListName = ?;
            `, [active, shoppingListName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateShoppingListName(shoppingListName: string, newShoppingListName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            UPDATE shopping_lists
                SET shoppingListName = ?
                    WHERE shoppingListName = ?;
            `, [newShoppingListName, shoppingListName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async deleteShoppingList(shoppingListName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM shopping_lists
                WHERE shoppingListName = ?;
            `, [shoppingListName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async selectShoppingListItems(shoppingListName: string): Promise<CurrentItems[]> {
        return await this.runQuery(`
        SELECT goodsName AS itemName, quantity
            FROM shopping_lists_goods
                WHERE shoppingListName = ?
                    ORDER BY goodsName
            `, [shoppingListName]);
    }

    static async insertItemToShoppingList(itemName: string, shoppingListName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            INSERT INTO shopping_lists_goods (shoppingListName, goodsName)
                VALUES (?, ?);
            `, [shoppingListName, itemName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async deleteItemFromShoppingList(itemName: string, shoppingListName: string): Promise<boolean> {
        try {
            await this.runQuery(`
            DELETE FROM shopping_lists_goods
                WHERE shoppingListName = ?
                AND goodsName = ?;
            `, [shoppingListName, itemName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    static async updateShoppingListItemQuantity(itemName: string, shoppingListName: string, quantity: number): Promise<boolean> {
        try {
            await this.runQuery(`
            UPDATE shopping_lists_goods
                SET quantity = ?
                    WHERE shoppingListName = ?
                    AND goodsName = ?
            `, [quantity, shoppingListName, itemName]);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * @returns the shopping list which is sorted by the categories
     * in the given shopId.
     * Items, which are not provided in the shop are not returned!
     * @param availableShopItems defines if the function should return the items,
     * which are buyable in this shop. When this parameter is set to false, only
     * the items are shown, which are not buyable in this shop.
     */
    static async generateShoppingList(shopId: number, availableShopItems: boolean): Promise<string> {
        let query = `
        SELECT goodsName || ' X ' || sum(quantity) AS itemWithQuantity
            FROM (
                SELECT goodsName, quantity
                    FROM shopping_lists_goods
                        WHERE shoppingListName IN (
                            SELECT shoppingListName
                                FROM shopping_lists
                                    WHERE active = 1
                        )

                UNION ALL

                -- ingredients for the meals
                SELECT meals_food.food, (meals_food.quantity * shopping_lists_meals.quantity) AS quantity
                    FROM meals_food
                        JOIN shopping_lists_meals
                        ON shopping_lists_meals.meal = meals_food.meal

                UNION ALL
        
                -- ingredients for the related meals of the meals
                SELECT meals_food.food, (meals_food.quantity * shopping_lists_meals.quantity) AS quantity
                    FROM meals_food
                        JOIN shopping_lists_meals
                        ON meals_food.meal IN (
                            SELECT related_meal
                                FROM meals_related_component
                                    WHERE meal = shopping_lists_meals.meal
                        )

            ) combinedGoods
                JOIN goods_categories_shop_order
                ON goods_categories_shop_order.shop_id = ?
                AND goods_categories_shop_order.category = (
                    SELECT category
                        FROM goods
                            WHERE name = combinedGoods.goodsName
                )
                    WHERE goodsName ${availableShopItems ? '' : 'NOT'} IN (
                        SELECT name
                            FROM goods_shops
                                WHERE shop_id = ?
                    )
                        GROUP BY goodsName
                            ORDER BY goods_categories_shop_order.\`order\`;
        `;
        const items = await this.runQuery<{ itemWithQuantity: string }>(query, [shopId, shopId]);
        const itemsAsString = items.map(item => item.itemWithQuantity);
        const emptyString = '';
        return itemsAsString.reduce((previous, current) => {
            let delimiter = '\n';
            if (previous == emptyString) {
                delimiter = emptyString;
            }
            return previous + delimiter + current;
        }, emptyString)
    }

    /**
     * @returns the recipes of the meals, which are included in
     * the table shopping_lists_meals.
     */
    static async getRecipesOfSelectedMeals(): Promise<string> {
        const meals: MealWithoutComponent[] = await this.runQuery(`
        SELECT name, coalesce(recipe, '') AS recipe
            FROM meals
                JOIN shopping_lists_meals
                ON shopping_lists_meals.meal = meals.name;
        `);
        let recipes = '';
        for (const meal of meals) {
            const relatedMeals: MealWithoutComponent[] = await this.runQuery(`
            SELECT name, coalesce(recipe, '') AS recipe
                FROM meals
                    WHERE name IN (
                        SELECT related_meal
                            FROM meals_related_component
                                WHERE meal = ?
                    );
            `, [meal.name]);
            recipes += `-------${meal.name}-------\n`;
            recipes += meal.recipe + '\n';
            relatedMeals.forEach(relatedMeal => {
                recipes += `\n${relatedMeal.name}: \n`;
                recipes += relatedMeal.recipe += '\n'
            });
            recipes += '\n\n';
        }
        return recipes;
    }
}
