import Component from "../Component";
import Database from "../../database/Database"
import Shop from "../../types/Shop";
import GoodsShops from "../../types/GoodsShops";
import Item from "../../types/Item";
import goodsShopAssignementPartials from "./goodsShopAssignementPartials";

export default class GoodsShopAssignement extends Component {

    constructor(
        container: HTMLElement,
        private item: Item
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
                Database.addShopToItem(shop, this.item);
            } else {
                Database.removeShopFromItem(shop, this.item);
            }
        }
        return checkbox;
    }

    private async insertShops() {
        const shops = await Database.selectAllShops();
        const goodsShops = (await Database.selectGoodsShops()).filter(shop => shop.name == this.item.name);
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