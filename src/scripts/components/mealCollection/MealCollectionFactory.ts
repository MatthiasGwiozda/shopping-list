import MealCollection, { MealCollectionDeps } from "./MealCollection";

export default class MealCollectionFactory {

    constructor(private deps: MealCollectionDeps) { }

    create(container: HTMLElement): MealCollection {
        return new MealCollection(container, this.deps)
    }
}
