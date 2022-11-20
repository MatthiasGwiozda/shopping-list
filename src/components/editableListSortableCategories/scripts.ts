import Component from "../Component";
import Database from "../../scripts/Database"
import Shop from "../../scripts/types/Shop";
import editableListSortableCategoriesPartials from "./editableListSortableCategoriesPartials";

export default class editableListSortableCategories extends Component {
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
        return editableListSortableCategoriesPartials.template;
    }

    private paragraphOfCurrentInstanceDragged(): boolean {
        return this.categoryElements.includes(editableListSortableCategories.currentDraggedElement);
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
            editableListSortableCategories.currentDraggedElement = p;
        }
        p.ondragenter = () => {
            if (this.paragraphOfCurrentInstanceDragged()) {
                p.classList.add(editableListSortableCategories.dragoverClass);
            }
        }
        p.ondragleave = function () {
            p.classList.remove(editableListSortableCategories.dragoverClass);
        }
        p.ondrop = async function () {
            p.classList.remove(editableListSortableCategories.dragoverClass);
            const fromElement = editableListSortableCategories.currentDraggedElement;
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