- edit an meal - component. There should not be a possibility to add meal components to this meal - component
- edit an Meal, which is not an meal - component. There should be an possibility to add meal - components.
- create a meal as "non component". Add related meals to that meal. Now add the "component" - Flag to this meal.
    - An error should appear while trying to save the meal as component. a component cannot have other meal - components. The user
    must delete all the related meals first.
- click on the ingredients - button in one meal. Now klick on the edit - button in another meal - component. Change it to a "non Meal component"
Now try to add the meal, which is not a component anymore, as a meal component in the meal in which you are editing the ingrediants at the moment.
    - An error - message should appear and the entry should not be added to the database.
- try to remove the "meal component" - checkbox from a meal component, which is already in use by other meals.
    - an confirmation - box should appear before the meal - component state is deleted. The confirmation - box should show where the component is in use currently. When the user confirms, the meal will be removed from the components - table.
    from all the meals, which were related to that component.