# Todos
- Implement shoppingList - component
    - Allow to add meals_components in the list - But only when the user activates the checklist and knows explicitly that he is about to add meals_components instead of a complete meal.

# Optimization / nice to have
- create initial categories
- Create documentation!
- Implement search - form for EditableLists
- disable the pages, which should not be useable when certain elements are not added, yet
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