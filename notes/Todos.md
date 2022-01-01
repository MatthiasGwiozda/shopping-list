# Todos
- implement categories - view
    - create reuseable table - component, which can INSERT, UPDATE and DELETE elements
        - UPDATE: 
            - optimize styling of edit - button. It Should be the same width as the delete - button
            - insert the old values in the input - fields when clicking on the "update" button
            
        

        - tests at the end:
            - what if all elements are deleted and the page is reloaded?
                - no error should be visible in the console
                - only the "add new elements icon should be shown"
            - initialization of empty database
            - delete
            - insert
                - insert new element when no elements were inserted, yet
                - insert new element while there are already elements in the database.
                - the "cancel" - button should remove the row.
            - update
                - the "cancel" - button should show the current element.

- Menu should be fixed, whenn scolling down on a large page

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.