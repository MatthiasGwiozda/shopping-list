import Database from "../../scripts/Database";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import InputUtilities from "../../scripts/utilities/InputUtilities";
import { Components } from "../../types/components/Components";
import Meal from "../../types/Meal";
import MealInformation from "../../types/MealInformation";
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

    /**
     * @returns the meals, which either are useable in the mealCollection or aren't.
     * @param useableMeals you can define if this function should return the useableMeals
     * or the meals without related meals and food by setting this parameter.
     */
    private filterMeals(meals: Meal[], mealsInformation: MealInformation[], useableMeals: boolean): Meal[] {
        return meals.filter(meal => {
            const mealInfo = mealsInformation.find(mealInfo => mealInfo.name == meal.name);
            return useableMeals ? mealInfo.useableMeal : !mealInfo.useableMeal;
        });
    }

    async insertMealsToSelect() {
        const meals = await Database.selectAllMeals();
        const mealsInformation = await Database.selectMealsInformation();
        const useableMeals = this.filterMeals(meals, mealsInformation, true);
        const unusableMeals = this.filterMeals(meals, mealsInformation, false);
        // Get the names of the meals as arrays
        const unusableMealnames = this.getMealNames(unusableMeals);
        const mealComponents = this.getMealNames(useableMeals, true);
        const fullMeals = this.getMealNames(useableMeals, false);
        // Insert the meals into the array
        this.addItemsToSelect('Full meals', fullMeals);
        this.addItemsToSelect('Meal components', mealComponents);
        this.addItemsToSelect('Meals without food', unusableMealnames, true);
    }

    /**
     * @returns The names of the meals. Through the parameter "component" you
     * can define whether component - meals or non component meals are returned.
     */
    getMealNames(meals: Meal[], component?: boolean): string[] {
        return meals
            .filter((meal) => {
                if (component == null) {
                    return true;
                } else {
                    return meal.component == component
                }
            })
            .map(meal => meal.name);
    }

    addItemsToSelect(groupname: string, items: string[], disabledItems = false) {
        if (items.length) {
            const optgroup = document.createElement('optgroup');
            if (disabledItems) {
                optgroup.disabled = true;
            }
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
        InputUtilities.setDefaultNumberInputAttributes(quantityInput);
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