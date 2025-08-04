import Shops, { ShopsDeps } from "../../../../components/shops/Shops";
import ObserverableMenuComponentFactory from "../interfaces/ObserverableMenuComponentFactory";

export default class ShopsFactory implements ObserverableMenuComponentFactory {

    constructor(private deps: ShopsDeps) { }

    getComponent(container: HTMLElement): Shops {
        return new Shops(container, this.deps);
    }
}
