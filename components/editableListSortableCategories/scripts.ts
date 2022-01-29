import { Components } from "../../types/components/Components";
import Component from "../Component";
import Database from "../../scripts/Database"

export default class editableListSortableCategories extends Component<Components.editableListSortableCategories> {
    rendered() {
        this.showCategories();
    }

    private async showCategories() {
        const categories = await Database.selectGoodsCategoriesShopOrder(this.componentParameters);
        // create Html
        const categoryOrderContainer = this.container.querySelector('.categoryOrder');
        categories.forEach((categoryInfo) => {
            const { category } = categoryInfo;
            const p = document.createElement('p');
            p.innerText = category;
            categoryOrderContainer.appendChild(p);
        });
    }
}