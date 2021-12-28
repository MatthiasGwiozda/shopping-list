import { Components } from "./Components"
import Categories from "../../components/categories/scripts"
import EditableList from "../../components/editableList/scripts"
import Items from "../../components/items/scripts"
import Meals from "../../components/meals/scripts"
import ShoppingList from "../../components/shoppingList/scripts"
import Shops from "../../components/shops/scripts"

/**
 * The classes for each component.
 * The advantage of this type is, that the injectComponent - function
 * knows implicit, which Component will be returned.
 * @todo: how to avoid circular dependency? :
 * `Components/categories/scripts` --> `ComponentUtilities.ts` --> thisFile --> `Components/categories/scripts`
 */
type ComponentClasses = {
    [Components.categories]: Categories
    [Components.items]: Items
    [Components.meals]: Meals
    [Components.shoppingList]: ShoppingList
    [Components.shops]: Shops
    [Components.editableList]: EditableList
}

export default ComponentClasses;