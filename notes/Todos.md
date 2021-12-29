# Todos
- implement categories - view
    - create reuseable table - component, which can INSERT, UPDATE and DELETE elements
        - implement DELETE functionality
            - tests:
                - delete was successful
                    - data should reload
                - item is used in another component (ON DELETE RESTRICT)
                    - error message should be shown
                - what if all elements are deleted and the page is reloaded?
                    - no error should be visible in the console
                - test at the end: initialization of empty database
        - implement UPDATE functionality
        - implement INSERT functionality

- Menu should be fixed, whenn scolling down on a large page

# Optimization / nice to have
- create Skript (plop?) to create new Component
- create electron skeleton with current Components - architecture
- test, if installing this repository from scratch works fine.