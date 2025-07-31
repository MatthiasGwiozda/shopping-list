import { test } from "node:test";
import { equal } from "node:assert";
import Database from "../../../scripts/database/Database";

test.skip("Database", async (t) => {

    await t.test("run query generateShoppingList", async () => {
        const result = await Database.generateShoppingList(1, true);
        equal(result.length > 0, true);
    })
})