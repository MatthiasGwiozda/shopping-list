- remove all meals from mealCollection
    - no data should be contained in the table "shopping_lists_meals"

- add a meal to the list
    - the added meal should be visible in the table "shopping_lists_meals"

- add two meals to the list
    - the meals should both be added to the list

- set the quantity of a meal to 0
    - The change should not be made in the database

- Set the quantity to something > 1
    - The quantity should be saved in the database

- Set the quantity to 1,000,000
    - The quantity should not be saved in the database

- Set the quantity to 999,999
    - The quantity should be saved in the database