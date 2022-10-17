# How is routing implemented?
## possibilities
- plain HTML pages
    - advantages
        - routing mechanism of the browser is used
    - disadvantages
        - boilerplate html - pages must be created
        - when a page is reloaded, sqlite is not usable anymore.
            - https://github.com/mapbox/node-sqlite3/issues/1370#issuecomment-969309591
            - https://github.com/electron/electron/issues/18397
        - chrome reloads the complete page. This computation is expensive
- inject html into a dynamic container. The html - content can be generated through a script dependent of the current route
    - advantage
        - no boilerplate - code
        - sqlite will work correctly
    - disadvantages
        - routing mechanism of the browser won't be used

## decission
custom skript, which injects the component into the html