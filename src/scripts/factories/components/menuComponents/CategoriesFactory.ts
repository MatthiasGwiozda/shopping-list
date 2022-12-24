import Categories from "../../../../components/categories/scripts";
import ComponentFactory from "../interfaces/ComponentFactory";

export default class CategoriesFactory implements ComponentFactory {

    getComponent(container: HTMLElement): Categories {
        return new Categories(container);
    }
}
