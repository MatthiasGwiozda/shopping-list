# Todos
- Create production deployment script
    - insert lib + node_modules - folder in electron zip archive
    - change icon of electron.exe
    - test deployment
        - only non dev - dependencies should be included in the production distribution
- [Create documentation](https://github.com/MatthiasGwiozda/shopping-list/tree/main/documentation)!
    - show that experts may use db Browser to use sql and to migrate data easily.
- create electron skeleton with current Components - architecture

# Ideas
- allow side - dishes to have side - dishes themselves. This can be useful for dips, which includes one "base sauce" for all dips: https://lieblingsgeschmack.de/5-blitz-sossen-fuer-raclette-und-fondue/

- Find queries, which make multiple statements and wrap them in a single transaction.
    - This issue is not critical. It might for example happen, that a category is inserted and
    not assigned to all shops. But the category could be deleted in this case.
    - The problem is that sqlite3 doesn't make it easy to implement such transactions.
    We will wait till one of this issues are resolved:
    https://github.com/TryGhost/node-sqlite3/issues/3
    https://github.com/TryGhost/node-sqlite3/issues/304
    https://github.com/TryGhost/node-sqlite3/issues/773
    https://github.com/TryGhost/node-sqlite3/issues/1251
