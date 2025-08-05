import GoodsShopAssignement, { GoodsShopAssignementDeps } from "../../../../../components/goodsShopAssignement/GoodsShopAssignement";
import Item from "../../../../../types/Item";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class GoodsShopAssignementAdditionalActionFactory implements AdditionalActionFactory<Item> {

    constructor(private deps: GoodsShopAssignementDeps) { }

    getComponent(container: HTMLElement, item: Item): GoodsShopAssignement {
        return new GoodsShopAssignement(container, item, this.deps);
    }
}
