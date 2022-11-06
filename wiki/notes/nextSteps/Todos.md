# Todos
## remove dynamic imports´
- remove importing of html - files
  - [x] refactor gethtmlFromFile
    - [x] pass a html - string to the function
    - [x] create a div
    - [x] set the innerHtml of the div with the passed html - string
    - [x] return the first - child
    - [x] remove getFileAsHtmlElement from HtmlUtilities
    - [x] move getRootNode + references to HtmlUtilities
    - [x] save all the partials in typescript - variables in all the components, which uses them
    - [x] pass the partials as strings to the new getRootNode - function
    - [x] delete old partials.html - files


  - remove component - parameter from Component.ts constructor
  - remove component - parameter from constructor - type

  - Add a abstract function im Component.ts, which returns the html - files `getTemplate`
  - change injectHtmlToElement to use `getTemplate`
  - return the html - files in the `getTemplate` - function in all components
  - remove the obsolete html - files (not partials)  
  - remove htmlElement - parameter from injectComponent
  - get htmlElement from the instance of the component
  - make injectComponent non static
  - remove the component - parameter from injectComponent


- remove the dynamic import in injectComponentScript
  - Delete the Components - enum
    - Make Component non generic
    - implement constructors in Components
    - remove references of ComponentParameters - type
    - remove ComponentParameters - type
    - remove component - parameter from constructor in Component.ts
    - 
    - make injectComponent non static


    - delete the Components - enum
    - delete ComponentConstructor






- move sql - files to JavaScript

- change deployment - Script
    - Dont copy html - files manually in deployment
    - Dont copy sql - files in deployment
    - Dont ignore ts - files anymore when copying folders

- Test
  - getRootNode - references with partials
  - deployment

- merge branch to main
