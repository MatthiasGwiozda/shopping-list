# Todos
- implement categories - view
    - create reuseable table - component, which can INSERT, UPDATE and DELETE elements
        - implement INSERT functionality
            - Tests:
                - when the list is long, the website should not jump when reloading the component.
                - insert new element when no elements were inserted, yet
                - insert new element while there were elements in the database.
                - don't allow to add multiple elements?
        - implement UPDATE functionality
        - move "gethtmlFromFile" function: move in Components - class and create new "partials - folder" in the skeleton. Files should always be in the same foldername for each component.

        - tests at the end:
            - what if all elements are deleted and the page is reloaded?
                - no error should be visible in the console
                - only the "add new elements icon should be shown"
            - initialization of empty database

- Menu should be fixed, whenn scolling down on a large page

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.