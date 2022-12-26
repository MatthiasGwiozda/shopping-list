import Shops from "../../../../../components/shops/scripts";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class ShopsFactory implements ObserverableMenuComponentFactory {

    getComponent(container: HTMLElement): Shops {
        return new Shops(container);
    }
}
