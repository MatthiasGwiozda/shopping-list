# Do I use react / vue 
- advantages of using the frameworks
    - I learn something about the framework.
    - no boilerplate html - pages
        - It's not that bad because there are not many pages in this webapp
        - HTML - Elements can be injectes automatically with plain js
    - Data Binding
- disadvantages of using the frameworks
    - more overhead in the application.
## decission
first I start without react or vue.

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
- inject html into a dynamic container. The html - content can be generated through a script dependent of the current route
    - advantage
        - no boilerplate - code
        - sqlite will work correctly
    - disadvantages
        - routing mechanism of the browser won't be used
## decission
custom skript, which injects the component into the html

# What are components?
components in this context are simple html pages with JavaScript - logic and css styles. Some of them can be accessed through the main menu of the application.

In general components are reusable pieces of code, which includes html and JavaScript.
Components may be designed to only be used once on the page. A component may be used multiple times, just like javaScript functions.

A component can even use other components. The injectComponent function in the ComponentUtilities can be used by the "hosting" component for this purpose.
