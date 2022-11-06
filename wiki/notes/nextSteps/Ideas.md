# Ideas
- Create a documentation for updating to a new version of shoppinglist

- make functions smaller

- create language - packages
  - german
  - Centralize messages
  - Some messages require dynamic elements

- use fuzzy search to find items easier
    - in editableList
    - for itemCollection.

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

- remove sandbox: false for security - reasons
  - https://github.com/electron-userland/electron-forge/issues/2931
  - https://www.electronjs.org/docs/latest/tutorial/sandbox#configuring-the-sandbox

- Set an .ico - file for electron.exe after build
  - Problem: currently there is a bug in rcedit, which does shady stuff with exe - files: https://github.com/electron/electron-packager/issues/590
