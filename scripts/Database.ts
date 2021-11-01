import * as sqlite3 from 'sqlite3';
var db = new sqlite3.Database('test.db');

// https://www.npmjs.com/package/sqlite3
class Database {
    static initializeDatabase() {
        db.serialize(function () {
            db.run("CREATE TABLE lorem (info TEXT)");
        });
        db.close();
    }
}

Database.initializeDatabase()