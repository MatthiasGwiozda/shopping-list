import Shops from "../../../../../components/shops/scripts";
import MenuComponentFactory from "../interfaces/MenuComponentFactory";

export default class ShopsFactory implements MenuComponentFactory {

    getComponent(container: HTMLElement): Shops {
        return new Shops(container);
    }
}
