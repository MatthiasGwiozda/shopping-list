
export default interface MealInformation {
    name: string;
    recipe: string;
    hasRelatedMeals: boolean;
    hasMealsFood: boolean;
    /**
     * When this property is set to true,
     * the meal has either related meals or
     * has food assigned to itself.
     */
    useableMeal: boolean;
}
