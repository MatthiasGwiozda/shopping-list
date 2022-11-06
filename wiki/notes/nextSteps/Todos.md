# Todos
## remove dynamic imports

- remove importing of html - files
  - Add a abstract function im Component.ts, which returns the html - files `getTemplates`
  - change injectHtmlToElement to use `getTemplates`
  - export the templates in all the components
    - return the html - files in the `getTemplates` - function
  - remove the obsolete html - files

- remove the dynamic import in injectComponentScript
  - create a mapping, which maps the components js - files to the Components - enum
  - Use the mapping to instanciate the selected component

- move sql - files to JavaScript

- change deployment - Script
    - Dont copy html - files manually in deployment
    - Dont copy sql - files in deployment
    - Dont ignore ts - files anymore when copying folders

- merge branch to main
