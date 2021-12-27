# installation
Run this commant in the terminal:

    npm install

# start app
Run this commant in the terminal:

    npm run start

# Definition of keywords
## components
components in this context are simple html pages with JavaScript - logic and css styles. Some of them can be accessed through the main menu of the application.

In general components are reusable pieces of code, which includes html and JavaScript.
Components may be designed to only be used once on the page. A component may be used multiple times, just like javaScript functions.

# questions
- Do I use react / vue --> decission: first I start without react or vue.
    - advantages of using the frameworks
        - I learn something about the framework.
        - no boilerplate html - pages
            - It's not that bad because there are not many pages in this webapp
            - HTML - Elements can be injectes automatically with plain js
        - Data Binding
    - disadvantages of using the frameworks
        - more overhead in the application.
- How is routing implemented? --> decission: custom skript, which injects the component into the html
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
        
# Ideas
- allow side - dishes to have side - dishes themselves. This can be useful for dips, which includes one "base sauce" for all dips: https://lieblingsgeschmack.de/5-blitz-sossen-fuer-raclette-und-fondue/

# Todos
- implement routing as SPA.
    - remove "elements". Everything should be a component
        - test: what happens with a script when a component is unloaded and loaded again?
            - the script is not loaded again, as it is in the node - cache
            - when we remove the script from cache, there could be unexpected behaviour when using the same
            component twice at the same time. It's better to use a function to inject the element into the container. Additionally the component should be able to be loaded twice (even at the same time).
            - implement Component - class in all components + skeleton
- implement categories - view
    - create reuseable table - component, which can INSERT, UPDATE and DELETE elements
        - pass data from the database in the reusable element
            - Problem: when accessing the database in a component, the app is crashing after multiple db - queries have run 
                - https://stackoverflow.com/questions/32504307/how-to-use-sqlite3-module-with-electron ?
                


# electron-quick-start

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start).