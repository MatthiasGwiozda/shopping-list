import Categories, { CategoriesDeps } from "../../../../components/categories/Categories";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class CategoriesFactory implements ObserverableMenuComponentFactory {

    constructor(private deps: CategoriesDeps) { }

    getComponent(container: HTMLElement): Categories {
        return new Categories(container, this.deps);
    }
}
