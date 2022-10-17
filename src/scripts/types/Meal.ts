
export default interface Meal {
    name: string;
    recipe: string;
    /**
     * when the meal is a component, it may be referenced
     * by "full" meals.
     * Components are reusable meals, which may be used in
     * multiple "full" meals. This may be a side dish but
     * doesn't have to be.
     */
    component: boolean;
}

export type MealWithoutComponent = Omit<Meal, 'component'>;
