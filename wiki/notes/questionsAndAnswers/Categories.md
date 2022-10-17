# Should categories be directly assigned to shops and vice versa, when creating new shops or categories?
- advantages:
    - the user must not take care of the assignement himself. If the user wishes, he can change the order of the categories in a shop.
- disadvantages:
    - when deleting categories, the assignement to the shop must be dropped
        - actually this is not a problem we could use "ON DELETE CASCADE" only for the shops -> categories foreign key. This way the usery may delete categories, even if they are assigned to a shop.

## decission
- yes :)