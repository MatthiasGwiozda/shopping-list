import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { CurrentItems } from "../../types/components/itemCollection";
import Component from "../Component";

export default class EditableListMealIngredients extends Component<Components.editableListMealIngredients> {
    rendered() {
        this.initializeItemCollection();
        this.initializeRecipe();
    }

    private async initializeItemCollection() {
        Component.injectComponent(
            Components.itemCollection,
            this.container.querySelector('.itemCollectionContainer'),
            {
                insertItem: this.insertItem.bind(this),
                removeItem: this.removeItem.bind(this),
                updateQuantity: this.updateQuantity.bind(this),
                filter: (item) => item.food,
                currentItems: await this.getCurrentItems()
            }
        )
    }

    private getMealName() {
        return this.componentParameters.name;
    }

    private async getCurrentItems(): Promise<CurrentItems[]> {
        return Database.selectMealFood(this.getMealName());
    }

    private async insertItem(itemName: string): Promise<boolean> {
        return Database.insertMealFood(this.getMealName(), itemName);
    }

    private async removeItem(itemName: string): Promise<boolean> {
        return Database.deleteMealFood(this.getMealName(), itemName);
    }

    private async updateQuantity(itemName: string, quantity: number): Promise<boolean> {
        return Database.updateMealFoodQuantity(this.getMealName(), itemName, quantity);
    }

    private async initializeRecipe() {
        const recipeContainer = this.container.querySelector('.recipeContainer');
        const textarea = document.createElement('textarea');
        const currentMeal = this.componentParameters;
        textarea.value = currentMeal.recipe;
        textarea.oninput = () => {
            /**
             * we are only changing the recipe of the meal.
             * We can use the currentMeal because the sql - query
             * only uses the mealname to identify the oldMeal.
             */
            Database.updateMeal(currentMeal, {
                ...currentMeal,
                recipe: textarea.value
            });
        }
        recipeContainer.append(textarea);
    }
}