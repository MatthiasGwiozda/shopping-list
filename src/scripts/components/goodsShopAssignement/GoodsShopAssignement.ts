import Component from "../Component";
import Shop from "../../types/Shop";
import GoodsShops from "../../types/GoodsShops";
import Item from "../../types/Item";
import goodsShopAssignementPartials from "./goodsShopAssignementPartials";
import { ShopAccessObject } from "../../database/dataAccessObjects/AccessObjects";

export interface GoodsShopAssignementDeps {
    shopAccessObject: ShopAccessObject
}

export default class GoodsShopAssignement extends Component {

    constructor(
        container: HTMLElement,
        private item: Item,
        private deps: GoodsShopAssignementDeps,
    ) {
        super(container);
        this.insertShops();
    }

    protected getHtmlTemplate(): string {
        return goodsShopAssignementPartials.template;
    }

    private getShopAsString(shop: Shop) {
        let str = shop.shop_name;
        const separator = ' ';
        str += ' | ' + shop.postal_code + separator + shop.street + separator + shop.house_number;
        return str;
    }

    private getCheckbox(goodsShops: GoodsShops[], shop: Shop): HTMLInputElement {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (goodsShops.find(gs => gs.shop_id == shop.shop_id)) {
            // the shop is already assigned to the item
            checkbox.checked = true;
        }
        checkbox.onchange = () => {
            if (checkbox.checked) {
                this.deps.shopAccessObject.addShopToItem(shop, this.item);
            } else {
                this.deps.shopAccessObject.removeShopFromItem(shop, this.item);
            }
        }
        return checkbox;
    }

    private async insertShops() {
        const shops = await this.deps.shopAccessObject.selectAllShops();
        const allGoodsShops = await this.deps.shopAccessObject.selectGoodsShops();
        const goodsShops = allGoodsShops.filter(shop => shop.name == this.item.name);
        const container = this.container.querySelector('.goodsShopAssignement');
        for (const shop of shops) {
            const label = document.createElement('label');
            label.innerText = this.getShopAsString(shop);
            const checkbox = this.getCheckbox(goodsShops, shop);
            label.appendChild(checkbox);
            container.appendChild(label);
        }
    }
}