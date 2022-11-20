import Database from "../../scripts/Database";
import { Components } from "../../scripts/types/components/Components";
import { CurrentItems } from "../../scripts/types/components/itemCollection";
import Meal from "../../scripts/types/Meal";
import Component from "../Component";
import editableListMealIngredientsPartials from "./editableListMealIngredientsPartials";

export default class EditableListMealIngredients extends Component {

    constructor(
        container: HTMLElement,
        private meal: Meal
    ) {
        super(container);
        this.initializeItemCollection();
        this.initializeRecipe();
        this.initializeMealComponents();
    }

    protected getHtmlTemplate(): string {
        return editableListMealIngredientsPartials.template;
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
        return this.meal.name;
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

    /**
     * @returns the current meal. It can happen that the contents of a meal changes
     * and the editableList doesn't provide the newest data of the meal in
     * the componentParameters.
     */
    private async getCurrentMeal(): Promise<Meal> {
        const meals = await Database.selectAllMeals();
        return meals.find(meal => meal.name == this.meal.name);
    }

    private async initializeRecipe() {
        const currentMeal = await this.getCurrentMeal();
        const recipeContainer = this.container.querySelector('.recipeContainer');
        const textarea = document.createElement('textarea');
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
        const { component, name } = this.meal;
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