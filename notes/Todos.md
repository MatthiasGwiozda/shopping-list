# Todos
- Create component for Meals
    - Create additional action to edit the ingredients of a meal (editableListMealIngredients)
        - create component to add meal - components
            - Check all test - cases.


# Optimization / nice to have
- Create documentation!
- Implement shoppingList - component
    - Allow to add meals_components in the list - But only when the user activates the checklist and knows explicitly that he is about to add meals_components instead of a complete meal.
- Implement search - form for EditableLists
- disable the pages, which should not be useable when certain elements are not added, yet
- set a fixed width for actions - column so that the buttons are not "jumping" when editing elements.
- add google - maps link from shop - adress
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