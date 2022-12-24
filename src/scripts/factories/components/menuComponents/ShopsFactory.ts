import Shops from "../../../../components/shops/scripts";
import ComponentFactory from "../interfaces/ComponentFactory";

export default class ShopsFactory implements ComponentFactory {

    getComponent(container: HTMLElement): Shops {
        return new Shops(container);
    }
}
