import QueryExecutor from "./QueryExecutor";
import * as sqlite3 from 'sqlite3';

export default class QueryExecutorSqlite implements QueryExecutor {

    constructor(
        private sqliteDatabase: sqlite3.Database
    ) { }

    runQuery<T>(query: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.sqliteDatabase.serialize(() => {
                this.sqliteDatabase.all(query, params, (err, rows: T[]) => {
                    if (err != null) {
                        reject(err)
                    } else {
                        resolve(rows);
                    }
                });
            });
        });
    }
}
