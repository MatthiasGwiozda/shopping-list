- [Start the app for the first time](#start-the-app-for-the-first-time)
- [Menu - Items](#menu---items)
  - [Categories](#categories)
  - [Shops](#shops)
  - [Items](#items)
  - [Meals](#meals)
    - [Creation of new meals](#creation-of-new-meals)
    - [Meal components](#meal-components)
  - [Shopping List](#shopping-list)
    - [Meals](#meals-1)
    - [Static Lists](#static-lists)
    - [Generation of shopping lists](#generation-of-shopping-lists)
- [Hints](#hints)

# Start the app for the first time
Start the exe - file with the name `shopping-list.exe`, which can be found in the unpacked zip folder.

As this app is only a freetimeproject and no code signing certificate is used, windows tells you that this programm may be a threat.
Allow the start of the app if you want to use it.

# Menu - Items
In the menu on the left five categories are provided.

- Shopping List
- Items
- Categories
- Shops
- Meals

When opening the shopping list for the first time, you have to create the categories first.

## Categories
Categories are used to categorize all the items.
The advantage to use categories is that your shopping - lists will be generated in the order of the items in the shop, in which you will buy the items. This benefit is especially great for larger shopping lists.
While creating categories, the order is not relevant. You will set the order of the categories for each shop later.

Chose your categories wisely. The more categories you use, the harder it will be to categorize your items.
But less categories means less specific sorting of the shopping lists.
Don't worry: you can change your categorization afterwards if you want to.
It all depends on your needs.

Here is an example of categories to start with:

- baked goods
- vegetables
- fruits
- beverages
- seasonings
- hygiene
- canned goods
- refrigerated food
- frozen food
- milk products
- sweets

## Shops
The shops are created to be able to define multiple sortings for your categories. The following fields are used so you can identify
the shop easily:

- Shop Name
- Street
- House number
- Postal code

After the creation of a shop you can define the order of the categories in the shop through the 🆎 - Button.
You can move the categories up and down by clicking and dragging the category to another position.

It's not important that the order of the categories perfectly matches the order in the shop but: The better
the definition of the category - order, the less you will need to look on your complete shopping list while you are in the shop because
you are unsure if you are missing something. It saves time to define the category - order correctly so you don't need to walk back in the grocery store because you forgot an item, which was not at the expected position on your shopping list.
Remember: you may always change the order afterwards.

## Items
Here you will create all items. For every item you define a name, category and if it's useable when creating meals (column: food).
When an item is a "food-item" you will have the possibility to use the item as incredient for meals.

Through the 🏣 - Button you can define in which shops the item may be bought.
The shopping list will remember you that you can't buy certain items in specific shops when you are about
to generate a shopping list for a shop, which doesn't sell the item.
You can, but musn't define this information. It depends on you if you want to be remembered or not.

## Meals
You may define meals with recipes and ingredients.
The advantage of this feature is that you won't need to remember the ingredients of a meal everytime when creating a shopping - list.
You will just chose the meals and the shopping - list will generate a shopping list with all necessary ingredients.

### Creation of new meals
- To create a meal click on the "Add new ➕" - Button.
- Define a name for the meal
- Check the "Meal component" - Checkbox if this meal is a component for other meals [For more information see Meal components](#Meal-components)
- Click on the 💾 - Button to save the meal.
- Now click on the 🥔 - Button.
- Define the ingredients and quantity for each ingredient for this meal.
- Add a recipe if you want to.

### Meal components
Meal components are reusable parts of full meals. You may use them when you identified parts of meals, which have always the same ingredients.
Meal components may be side dishes but they musn't.

An example:
You are using **always the same vegetables** in the following meals:
- Rice with vegetables
- Gnocchi with vegetables
- Noodels with vegetables

It would make sense to create a meal component "vegetables", which
contains the vegetables you use in all this meals.

After you created the component "vegetables" you can assign this component to your full meals by clicking on the 🥔 - Button in the full meal.
Note that the meal component "vegetables" appeared under the headline "Meal components" in the ingredients - menu.
Select the meal component(s), which should be assigned to the full meal.
Now if you already have defined the vegetables in the ingredients - list of the full meal remove them there. Otherwise
the ingredients will be added twice when generating the shopping list.

You may use this feature to save time while creating meal ingredient lists.

## Shopping List
In this menu - section you can generate the complete shopping list.

### Meals
Under the headline **Meals** you can add and remove the meals. The ingredients of the added meals
will be used to generate the final shopping - list.

### Static Lists
Under the headline **Static Lists** you can simply add items, which will be generated in the proper order later.
There is the possibility to create multiple static lists with specific items.

Steps to create a static list
- enter a name for the list. **Example:** 'default'
- Click on the "Add list ➕" - Button
- Click on the ✏ - Button
- Add the items and the quantity for this list

You may disable a static list by clicking on the checkbox. When a static list is disabled,
the items won't be used to generate the shopping list.

### Generation of shopping lists
After you have defined the meals and your static lists you can generate the shopping list.
All the ingredients of the selected meals and the items, which were added to the active static lists will be added up,
ordered by the categories of the selected shop and printed in the **three** text - fields at the bottom of the page:
- Available items in selected shop
- Items, which can't be bought in this shop
- Recipes

Now you can copy the contents in the three text - fields for example to google keep [in your browser](https://keep.google.com/).
When you use google keep you can [change the note to a list](https://support.google.com/keep/answer/6395451?hl=en&co=GENIE.Platform%3DDesktop) afterwards. Now you can use the shopping list on your smartphone.
Of course you can use any app you want to move the shopping list to your
smartphone. Google keep is just a recommendation.

Note that this shopping list is generated based on the items, which you need. It doesn't know which items you already have.
After importing the generated shopping list to google keep, you can check how many items you really need to buy.

# Hints
- You can sort the elements by clicking on the column - name in the table.
- You can use strg + n to create new elements in the following areas:
  - Items
  - Categories
  - Shops
  - Meals
- There is a search - form, which let's you find items easily.
- When deleting items, you may use spacebar to swiftly confirm the deletion of an element