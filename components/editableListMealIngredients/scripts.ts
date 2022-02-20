import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import { CurrentItems } from "../../types/components/itemCollection";
import Component from "../Component";

export default class EditableListMealIngredients extends Component<Components.editableListMealIngredients> {
    rendered() {
        this.initializeItemCollection();
        this.initializeRecipe();
        this.initializeMealComponents();
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

    private async getAllMealComponents() {
        const meals = await Database.selectAllMeals();
        return meals.filter(meal => meal.component);
    }

    private async initializeMealComponents() {
        const { component, name } = this.componentParameters;
        const componentsWrapper: HTMLDivElement = this.container.querySelector('.components');
        if (!component) {
            const mealComponentsContainer = componentsWrapper.querySelector('.mealComponents');
            const mealComponents = await this.getAllMealComponents();
            const currentRelatedMeals = await Database.selectRelatedMealComponents(name);
            mealComponents.forEach(mealComponent => {
                const p = document.createElement('p');
                const label = document.createElement('label');
                label.innerText = mealComponent.name;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                if (currentRelatedMeals.includes(mealComponent.name)) {
                    checkbox.checked = true;
                }
                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        Database.setRelatedMealComponent(name, mealComponent.name)
                    } else {
                        Database.deleteRelatedMealComponent(name, mealComponent.name)
                    }
                }
                label.prepend(checkbox);
                p.append(label);
                mealComponentsContainer.append(p);
            })
        } else {
            // remove the container.
            componentsWrapper.remove();
        }
    }

}