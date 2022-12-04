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
  - [x] remove component - parameter from constructor - type
  - [x] remove component - parameter from Component.ts constructor

--- make injectComponent non static
  - [x] make injectComponent non static
  - [x] remove htmlElement - parameter from injectComponent
    - [x] use container instead

-- Component.ts

- create getTemplate
  - [x] Add a abstract function im Component.ts, which returns the html - files `getTemplate`
  - [x] change injectHtmlToElement to use `getTemplate`
- cleanups
  - [x] remove injectComponentScript - function
  - [x] remove the component - parameter from injectComponent
  - [x] delete getComponentFilePath
  - [x] delete FileType - enum
  - [x] Make Component non generic
  - [x] remove component - parameter from constructor in Component.ts
  - [x] delete render -function 

-- changes to all components
  - [x] delete ComponentConstructor
  - [x] parameters
    - [x] remove generic from all components
    - [x] call render in own constructor after calling super - constructor
    - [x] set all rendered - functions to private
    - [x] get component - parameters in all components - constructor, where needed
    - [x] remove references of ComponentParameters - type
    - [x] remove ComponentParameters - type
  - [x] use getTemplate
    - [x] return the html - files in the `getTemplate` - function in all components
    - [x] remove the obsolete index.html - files (not partials)

-- Component instanciation
  - [x] change all simple references to non static Component.injectComponent (instanciate the components where they are needed)
  - [x] fix additionalEditableListActions in editableList
    - [x] create interface for a factory for a Component with a generic parameter - type
    - [x] change additionalEditableListActions to get a ComponentFactory instead of the component - Parameter
    - [x] Rename editableListGoodsShopAssignement to dont use editableLisitPrefix
    - [x] Rename editableListMealIngredients to dont use editableLisitPrefix
    - [x] Rename editableListSortableCategories to dont use editableLisitPrefix
    - [x] create editableListGoodsShopAssignement - factory
    - [x] pass editableListGoodsShopAssignement - factory to editableList
    - [x] create MealIngredients - factory
    - [x] pass MealIngredients - factory to editableList
    - [x] create SortableCategories - factory
    - [x] pass SortableCategories - factory to editableList
    - [x] use AdditionalActionFactory in editableList


  - [] fix menu.ts
    - [] refactoring
      - [x] move menu.ts in menu - folder
      - [x] extract types in separate files
      - [] make Menu - class out of current functions
      
    - [] don't use Components - enum to instanciate a Component
    - [] make MenuComponents type obsolete
    - [] make ReadyCheckComponents obsolete
  

  - [] Delete the Components - enum



-- refactoring

  - [] Rename component - files from index.ts to proper component - names





- move components - folder into scripts
- move sql - files to JavaScript

- change deployment - Script
    - Dont copy html - files manually in deployment
    - Dont copy sql - files in deployment
    - Dont ignore ts - files anymore when copying folders

- Test
  - getRootNode - references with partials
  - AdditionalActionFactory
  - deployment

- Docs
  - change injectComponent - docs


- merge branch to main
