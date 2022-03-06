import Database from "../../scripts/Database";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import { Components } from "../../types/components/Components";
import Meal from "../../types/Meal";
import Component from "../Component";

export default class MealCollection extends Component<Components.mealCollection> {
    private select: HTMLSelectElement;
    private readonly selectName = 'selectedMeal';

    rendered() {
        this.select = this.container.querySelector('.mealsPicker select');
        this.select.name = this.selectName;
        this.showCurrentMeals();
        this.insertMealsToSelect();
        this.initializeFormSubmit();
    }

    async insertMealsToSelect() {
        const meals = await Database.selectAllMeals();
        const mealComponents = this.getMealNames(meals, true);
        const fullMeals = this.getMealNames(meals);
        this.addItemsToSelect('Full meals', fullMeals);
        this.addItemsToSelect('Meal components', mealComponents);
    }

    /**
     * @returns The names of the meals. Through the parameter "component" you
     * can define whether component - meals or non component meals are returned.
     */
    getMealNames(meals: Meal[], component = false): string[] {
        return meals.filter((meal) => meal.component == component).map(meal => meal.name);
    }

    addItemsToSelect(groupname: string, items: string[]) {
        if (items.length) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupname;
            items.forEach(item => {
                const option = document.createElement('option');
                option.innerText = item;
                optgroup.appendChild(option);
            });
            this.select.append(optgroup);
        }
    }

    addMealToCollection(mealName: string, quantity = 1) {
        const mealsContainer = this.container.querySelector('.meals');
        const itemHTML = this.gethtmlFromFile('item.html');
        // delete - button functionality
        const deleteButton = itemHTML.querySelector('button');
        deleteButton.onclick = async () => {
            const deleted = await Database.deleteMealFromShoppingList(mealName);
            if (deleted) {
                itemHTML.remove();
            } else {
                DialogUtilities.alert(`The meal could not be deleted.`);
            }
        }
        // change quantity of meal
        const quantityInput = itemHTML.querySelector('input');
        quantityInput.value = quantity.toString();
        quantityInput.oninput = async () => {
            if (quantityInput.validity.valid) {
                await Database.updateMealShoppingListQuantity(mealName, parseInt(quantityInput.value));
            }
        }
        // add the label for the meal
        const label = itemHTML.querySelector('label');
        label.innerText = mealName;
        // append item to mealsContainer
        mealsContainer.append(itemHTML);
    }

    async showCurrentMeals() {
        const currentMeals = await Database.selectAllMealShoppingList();
        currentMeals.forEach(mealInfo => {
            this.addMealToCollection(mealInfo.meal, mealInfo.quantity)
        })
    }

    initializeFormSubmit() {
        const form = this.container.querySelector('form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const mealName = formData.get(this.selectName).toString();
            const inserted = await Database.insertMealToShoppingList(mealName);
            if (inserted) {
                this.addMealToCollection(mealName);
            } else {
                DialogUtilities.alert(`The meal could not be added. Maybe it's already in the list?`);
            }
        }
    }
}