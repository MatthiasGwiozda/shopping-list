import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class EditableListMealIngredients extends Component<Components.editableListMealIngredients> {
    rendered() {
        this.initializeItemCollection();
    }

    private async initializeItemCollection() {
        Component.injectComponent(
            Components.itemCollection,
            this.container.querySelector('.itemCollectionContainer'),
            {
                insertItem: this.insertItem,
                removeItem: this.removeItem,
                updateQuantity: this.updateQuantity,
                filter: (item) => item.food,
                currentItems: []
            }
        )
    }

    private async insertItem(itemName: string): Promise<boolean> {
        return true;
    }

    private async removeItem(itemName: string): Promise<boolean> {
        return true;
    }

    private async updateQuantity(itemName: string, quantity: number): Promise<boolean> {
        return true;
    }
}