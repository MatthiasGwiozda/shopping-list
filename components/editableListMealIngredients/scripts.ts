import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class EditableListMealIngredients extends Component<Components.editableListMealIngredients> {
    rendered() {
        Component.injectComponent(
            Components.itemCollection,
            this.container.querySelector('.itemCollectionContainer'),
            {
                insertItem: this.insertItem,
                removeItem: this.removeItem,
                filter: (item) => item.food
            }
        )
    }

    private async insertItem(itemName: string): Promise<boolean> {
        console.log(itemName);
        return true;
    }

    private async removeItem(itemName: string): Promise<boolean> {
        console.log(itemName);
        return true;
    }
}