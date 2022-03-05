import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class ShoppingList extends Component<Components.shoppingList> {
    rendered() {
        Component.injectComponent(
            Components.mealCollection,
            this.container.querySelector(".mealsList .container")
        )
    }
}