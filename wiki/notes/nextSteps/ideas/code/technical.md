# Technical Ideas
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