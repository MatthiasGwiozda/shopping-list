import Shops from "../../../../components/shops/Shops";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class ShopsFactory implements ObserverableMenuComponentFactory {

    getComponent(container: HTMLElement): Shops {
        return new Shops(container);
    }
}
