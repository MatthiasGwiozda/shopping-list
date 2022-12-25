import Categories from "../../../../../components/categories/scripts";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class CategoriesFactory implements MenuComponentFactory {

    getComponent(container: HTMLElement): Categories {
        return new Categories(container);
    }
}
