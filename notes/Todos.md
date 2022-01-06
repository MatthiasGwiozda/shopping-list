# Todos
- create shops with editableList
    - create element to change the order of the categories in the shops
        - add the possibility to create additional actions in an editableList.
            - For this purpose an abstract class "EditableListAction" will be created. 
                - this class will have an abstract function, which will be called after the editableList injected the element in the container. This function has one parameter "element". The parameters content will be the element for which the EditableListAction is used.
                - Additionally the Class "EditableListAction" must have the abstract property "buttonIcon", which the EditableList uses to get the icon for the action.
                - The EditableList - Component will then have a new Parameter from Type EditableListAction[]
                - The component will be rendered below the element, for which the action - button was klicked.



    - automatically add a newly created category to the goods_categories_shop_order - table?
    - add google - maps link from shop - adress

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.