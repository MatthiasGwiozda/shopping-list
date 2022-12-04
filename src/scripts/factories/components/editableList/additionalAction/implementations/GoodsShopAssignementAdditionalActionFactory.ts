import GoodsShopAssignement from "../../../../../../components/goodsShopAssignement/scripts";
import Item from "../../../../../types/Item";
import AdditionalActionFactory from "../AdditionalActionFactory";

export default class GoodsShopAssignementAdditionalActionFactory implements AdditionalActionFactory<Item> {

    getComponent(container: HTMLElement, item: Item): GoodsShopAssignement {
        return new GoodsShopAssignement(container, item);
    }
}
