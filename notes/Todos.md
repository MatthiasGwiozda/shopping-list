# Todos
- create shops with editableList
    - create element to change the order of the categories in the shops
        - Implement ordering of categories for shops with dragable elements. The changes should be saved imediately
        after an category have been dropped to another position. When an element is dropped on another element, the dragged element should appear on top of the element, on which is was dropped.
            - Next TODO: in moveCategoryShopOrderUp: get the order of the toElement first and update the fromElement statically to have a single update - transaction
            - TESTS
                - When dragging a category to the same category, nothing should change
                - When dragging a category to another shop, nothing should change. The drag should not even be possible.
                - During the drag there should appear a border at the top of the element so the user knows, that the element will be placed on top of an element when releasing it.
                - all categories should be shown when clicking on the order - button
                - The user should be able to delete a category, which is used in a shop.
                - add new shop when there are no categories in the database, yet
                - When creating a new shop: all categories should be assigned in the goods_categories_shop_order table
                - When creating a new shop and manipulating the categories immediatelly, the categories in the database should be updated
                - When creating a new category: all Shops should get this category in the goods_categories_shop_order table
                

    - automatically add a newly created category to the goods_categories_shop_order - table?
    - add google - maps link from shop - adress

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.
- test, if starting the app with an empty database works fine
    - categories_shop_order (ON DELETE CASCADE)