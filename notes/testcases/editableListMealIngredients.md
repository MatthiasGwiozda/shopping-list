# okay
- edit an meal - component. There should not be a possibility to add meal components to this meal - component
- edit an Meal, which is not an meal - component. There should be an possibility to add meal - components.
- create a meal as "non component". Add related meals to that meal. Now add the "component" - Flag to this meal.
    - The user needs to confirm this change to component.
        - When the user confirmed this change, all the related components should not be related anymore.
- delete a meal, which is a component and has ingredients assigned.
    - The deletion should be possible
- change the recipe of a meal. klick on the "edit recipe button". klick on the "edit recipe button" once again
    - the recipe should show the newest recipe
- create a meal. Add an recipe to the meal. Change the name of the meal. 
    - The recipe should not change after changing the name of the meal

# Check
- click on the ingredients - button in one meal. Now klick on the edit - button in another meal - component. Change it to a "non Meal component"
Now try to add the meal, which is not a component anymore, as a meal component in the meal in which you are editing the ingrediants at the moment.
    - An error - message should appear and the entry should not be added to the database.
- try to remove the "meal component" - checkbox from a meal component, which is already in use by other meals.
    - an confirmation - box should appear before the meal - component state is deleted. The confirmation - box should show where the component is in use currently. When the user confirms, the meal will be removed from the components - table.
    from all the meals, which were related to that component.