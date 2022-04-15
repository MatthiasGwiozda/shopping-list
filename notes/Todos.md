# Todos
- remove unneeded menu - elements
- allow right - click to copy texts, like generated shopping lists.

- compile programm with electron-packager to a exe - file

# Optimization / nice to have
- show ingredients in the recipe - field?
- create initial categories
- Create documentation!
    - show that experts may use db Browser to use sql and to migrate data easily.
- disable the pages, which should not be useable when certain elements are not added, yet
    - alternative: link the pages in the elements, which don't have the data, which it needs.
- set a fixed width for actions - column so that the buttons are not "jumping" when editing elements.
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.
- test, if starting the app with an empty database works fine
    - categories_shop_order (ON DELETE CASCADE)
- add keyboard shortcuts 
    - to add new element (strg + n)
    - to escape an edit - form in the editableList (esc)
- items
    - create possibility to show all the shops, which are assigned to the items in one view.
- Find queries, which make multiple statements and wrap them in a single transaction.
- allow side - dishes to have side - dishes themselves. This can be useful for dips, which includes one "base sauce" for all dips: https://lieblingsgeschmack.de/5-blitz-sossen-fuer-raclette-und-fondue/
- When deleting an category, which is used in an item, show in which items the category is used so the user doesn't need to search long.