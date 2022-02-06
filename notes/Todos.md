# Todos
create component to edit goods
    - allow to use checkbox - fields in editableList for specified columns

Questions:
- Which fields should be editable in the items?
    - item - name
        - Simple input
    - category for the item
        - as select - field
    - if the item can be used in meals or not
        - as Checkbox
    - goods_shops - Table: in which shop is the good available?
        - as additionalEditableListAction: List with all shops and a checkbox to toggle the availability of an item in the shop


# Optimization / nice to have
- allow sorting of columns in editableList.
- disable the pages, which should not be useable when certain elements are not added, yet
- set a fixed width for actions - column so that the buttons are not "jumping" when editing elements.
- Implement search - form
- add google - maps link from shop - adress
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.
- test, if starting the app with an empty database works fine
    - categories_shop_order (ON DELETE CASCADE)