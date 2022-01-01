# Todos
- implement categories - view
    - create reuseable table - component, which can INSERT, UPDATE and DELETE elements
        - implement UPDATE functionality

        - tests at the end:
            - what if all elements are deleted and the page is reloaded?
                - no error should be visible in the console
                - only the "add new elements icon should be shown"
            - initialization of empty database
            - delete
            - insert
                - insert new element when no elements were inserted, yet
                - insert new element while there are already elements in the database.
            - update

- Menu should be fixed, whenn scolling down on a large page

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.