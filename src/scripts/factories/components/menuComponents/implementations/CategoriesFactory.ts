import Categories from "../../../../components/categories/Categories";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class CategoriesFactory implements ObserverableMenuComponentFactory {

    getComponent(container: HTMLElement): Categories {
        return new Categories(container);
    }
}
