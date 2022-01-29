import { Components } from "../../types/components/Components";
import Component from "../Component";
import Database from "../../scripts/Database"

export default class editableListSortableCategories extends Component<Components.editableListSortableCategories> {
    private static currentDraggedElement: HTMLParagraphElement;

    rendered() {
        this.showCategories();
    }

    /**
     * @param category the name of the category
     * @returns the paragraph for the given category
     */
    private createCategoryParagraph(category: string): HTMLParagraphElement {
        const p = document.createElement('p');
        p.draggable = true;
        p.innerText = category;
        p.ondragstart = function (e) {
            editableListSortableCategories.currentDraggedElement = p;
        }
        p.ondrop = function () {
            const fromElement = editableListSortableCategories.currentDraggedElement;
            const toElement = p;
            if (fromElement != toElement) {
                // switch the order
            }
        }
        p.ondragover = function (e) {
            e.preventDefault();
        }
        return p;
    }

    private async showCategories() {
        const categories = await Database.selectGoodsCategoriesShopOrder(this.componentParameters);
        // create Html
        const categoryOrderContainer = this.container.querySelector('.categoryOrder');
        categories.forEach((categoryInfo) => {
            const p = this.createCategoryParagraph(categoryInfo.category);
            categoryOrderContainer.appendChild(p);
        });
    }
}