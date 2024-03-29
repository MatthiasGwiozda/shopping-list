import Component from "../Component";
import Database from "../../database/Database"
import Shop from "../../types/Shop";
import sortableCategoriesPartials from "./sortableCategoriesPartials";

export default class SortableCategories extends Component {
    private static currentDraggedElement: HTMLParagraphElement;
    private static readonly dragoverClass = 'dragover';
    /**
     * all the category - elements, which are
     * managed through this instance.
     */
    private categoryElements: HTMLParagraphElement[] = [];

    constructor(
        container: HTMLElement,
        private shop: Shop
    ) {
        super(container);
        this.showCategories();
    }

    protected getHtmlTemplate(): string {
        return sortableCategoriesPartials.template;
    }

    private paragraphOfCurrentInstanceDragged(): boolean {
        return this.categoryElements.includes(SortableCategories.currentDraggedElement);
    }

    /**
     * @param category the name of the category
     * @returns the paragraph for the given category
     */
    private createCategoryParagraph(category: string): HTMLParagraphElement {
        const p = document.createElement('p');
        p.draggable = true;
        p.innerText = category;
        const { shop } = this;
        p.ondragstart = function () {
            SortableCategories.currentDraggedElement = p;
        }
        p.ondragenter = () => {
            if (this.paragraphOfCurrentInstanceDragged()) {
                p.classList.add(SortableCategories.dragoverClass);
            }
        }
        p.ondragleave = function () {
            p.classList.remove(SortableCategories.dragoverClass);
        }
        p.ondrop = async function () {
            p.classList.remove(SortableCategories.dragoverClass);
            const fromElement = SortableCategories.currentDraggedElement;
            const toElement = p;
            if (fromElement != toElement) {
                // switch the order
                const res = await Database.moveCategoryShopOrder(fromElement.innerText, toElement.innerText, shop);
                if (res) {
                    toElement.before(fromElement);
                }
            }
        }
        /**
         * allows the drag, if the paragraph is a html - element of
         * this editableListSortableCategories - instance.
         */
        p.ondragover = (e) => {
            if (this.paragraphOfCurrentInstanceDragged()) {
                e.preventDefault();
            }
        }
        this.categoryElements.push(p);
        return p;
    }

    private async showCategories() {
        const categories = await Database.selectGoodsCategoriesShopOrder(this.shop);
        // create Html
        const categoryOrderContainer = this.container.querySelector('.categoryOrder');
        categories.forEach((categoryInfo) => {
            const p = this.createCategoryParagraph(categoryInfo.category);
            categoryOrderContainer.appendChild(p);
        });
    }
}