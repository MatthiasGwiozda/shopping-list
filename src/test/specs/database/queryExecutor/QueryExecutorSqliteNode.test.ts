import { test } from "node:test";
import { equal } from "node:assert";
import TestInstanceContainer from "../../../instanceContainer/TestInstanceContainer";

const { queryExecutorSqliteNode: queryExecutor } = new TestInstanceContainer();

test.skip("QueryExecutorSqliteNode", async (t) => {

    await t.test("run select query with parameters", async () => {
        const result = await queryExecutor.runQuery("SELECT * FROM meals WHERE name")
        equal(result.length > 0, true);
    })

    await t.test("run select query without parameters", async () => {
        const result = await queryExecutor.runQuery("SELECT * FROM meals WHERE name = ?", ["123"])
        equal(result.length > 0, true);
    })

    await t.test("run insert query", async () => {
        const result = await queryExecutor.runQuery("INSERT INTO meals(name, recipe) VALUES (?, ?)", ["meal4", "recipe2"])
        equal(result.length, 0);
    })

    await t.test("creates table", async () => {
        const result = await queryExecutor.runQuery("CREATE TABLE TestABC (a INT primary key)")
        equal(result.length, 0);
    })

    await t.test("acknowledges foreign key checks", async () => {
        try {
            await queryExecutor.runQuery("INSERT INTO goods(name, category) VALUES (?, ?)", ["goodTest", "notAvailable"])
        } catch (error) { return }
        throw new Error("expected Error, but none was thrown");
    })

    await t.test("throws error for unknown table", async () => {
        try {
            await queryExecutor.runQuery("SELECT * FROM unknownTable WHERE name")
        } catch (error) { return }
        throw new Error("expected Error, but none was thrown");
    })
})