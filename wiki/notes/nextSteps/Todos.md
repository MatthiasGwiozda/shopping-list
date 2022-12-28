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


  - [x] fix menu.ts
    - [x] move menu.ts in menu - folder
    - [x] extract types in separate files
    - [x] extract ComponentRoutes from menu.ts
    - [x] rename componentRoutes to ApplicationMenuRoutes
    --- Menu Class creation
    - [x] make Menu - class out of current functions
    - [x] rename menu.ts to Menu.ts
    -- create a factory
    - [x] create MenuFactory
    -- change references to use the instance - functions of Menu
    - [x] injectMenuElements
    --- Component factories for menu
    - [x] pass ComponentFactory in component property of MenuRoute
    - [x] create factories for the MenuComponents
      - [x] categories
      - [x] items
      - [x] meals
      - [x] shoppingList
      - [x] shops
    - [x] use ComponentFactories in ApplicationMenuRoutes
    - [x] use the factories in Menu.ts
    - [x] rename componentRoute to MenuRoute
    - [x] get MenuRoutes[] in constructor of Menu.ts
    - [x] pass ApplicationMenuRoutes in MenuFactory
    - [x] separate the HtmlElement property from MenuRoute to separate interface
      - [x] create MenuItem interface (holds htmlElement + MenuRoute)
      - [x] remove private MenuRoute - property in Menu class
      - [x] use createMenuRouteElements in constructor
      - [x] pass MenuRoutes parameter in createMenuRouteElements

    --- refreshReadyMenuComponents
    - [x] create a readyCheck - property in MenuRoute
    - [x] migrate to new structure
    - [x] create MenuRouteReadyChecker - class
    - [x] move refreshReadyMenuComponents - function to MenuRouteReadyChecker
    - [x] create interface "ObserverSubject" with functions 
      - [x] notifyObservers
      - [x] registerObserver
    - [x] create interface "Observer" with function 
      - [x] ObserverSubjectUpdated
    - [x] create new abstract class "MenuObserverComponent", which is of type "Component implements ObserverSubject"
    --- use MenuObserverComponent
    - [x] extend from MenuObserverComponent in the ObserverSubject components
    - [x] replace old refreshReadyMenuComponents - calls in ObserverSubjects with notifyObservers - function
      - [x] categories
      - [x] items
      - [x] shops
    --- refactoring
    - [x] rename ObserverableComponent to ObserverComponent
    - [x] move ObserverableComponent in components folder
    - [x] create a new "ObserverableMenuComponentFactory" class, which returns a ObserverableComponent
    - [x] make MenuRoute generic <FactoryType extends MenuComponentFactory | ObserverableMenuComponentFactory>
      - [x] let the componentFactory be of Type FactoryType
    - [x] use the ObserverableMenuComponentFactory for all components, which implement ObserverSubject
      - [x] categories
      - [x] items
      - [x] shops
    - [x] implement Observer interface in Menu
    - [x] check in menu if a ObserverableComponent is used
    - [x] use registerObserver function when a ObserverableComponent is used
  - [x] make ReadyCheckComponents obsolete
  - [x] don't use Components - enum
  - [x] Delete the Components - enum
--- refactoring
- [x] Rename component - files from index.ts to proper component - names
- [x] move components - folder into scripts
- [x] make Mealingredients - folder to lower case
- [x] make sortableCategories - folder to lower case


--- SQL - files in TypeScript files
- [x] create folder "databaseCreator" in database
- [x] move sql - folder in assets
- [x] change folder in FileUtilities

- [x] create class "DatabaseCreator"
- [x] move getDatabaseStructure from Database.ts in DatabaseCreator (private)
- [x] create public function "createDatabaseIfNotExistent" in DatabaseCreator
- [x] rename getDatabaseStructure in "getStructureStatements"
- [x] use DatabaseCreator.createDatabaseIfNotExistent in Database.ts

--- Test
- [x] does the application run? --> yes, but i forgot some null - checks😖


--- bugfix (DatabaseInstanciator)
- [x] create DatabaseInstanciator
- [x] let the DatabaseCreator just create the sqlite database
- [x] use DatabaseInstanciator in Database.ts

--- Deployment - Script
- [x] Dont copy html - files manually in deployment 
  - [x] remove './src/components' in $folders
- [x] Dont copy sql - folder manually in deployment 
  - [x] remove './src/sql', in $folders
- [x] Dont ignore ts - files anymore when copying folders



- [x] Test
  - [x] all editableList tests
  - [x] getRootNode - references with partials
  - [x] AdditionalActionFactory
  - [x] componentReadyChecks in Menu (menu.md - tests)
  - [x] creation of shopping lists
  - [x] structure.sql - file (creation of new Database if not existent)
  - [x] deployment

- [] Docs
  - [] change injectComponent - docs

- [] merge branch to main
- [] make a new release