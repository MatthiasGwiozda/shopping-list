import { test } from "node:test";
import { equal } from "node:assert";
import TestInstanceContainer from "../../instanceContainer/TestInstanceContainer";

const { database } = new TestInstanceContainer()

test.skip("Database", async (t) => {

    await t.test("run query generateShoppingList", async () => {
        const result = await database.generateShoppingList(1, true);
        equal(result.length > 0, true);
    })
})