import Database from "../../scripts/Database";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import InputUtilities from "../../scripts/utilities/InputUtilities";
import UniqueUtilities from "../../scripts/utilities/UniqueUtilities";
import Item from "../../scripts/types/Item";
import Component from "../Component";
import HtmlUtilities from "../../scripts/utilities/HtmlUtilities";
import itemCollectionPartials from "./itemCollectionPartials";

export default class ItemCollection extends Component {
    private readonly optgroupTagName = 'optgroup';
    private readonly defaultOptionValue = 'show all categories';

    constructor(container: HTMLElement) {
        super(container);
        this.initializeItemCollection()
    }

    private async getItems(): Promise<Item[]> {
        let items = await Database.selectAllItems();
        const { filter } = this.componentParameters;
        if (filter != null) {
            items = items.filter(item => filter(item));
        }
        return items;
    }

    private getItemSelectInput(): HTMLSelectElement {
        return this.container.querySelector('select[name="item"]');
    }

    private getItemsContainer() {
        return this.container.querySelector('.items');
    }

    private getForm() {
        return this.container.querySelector('form');
    }

    private getItemSearchInput() {
        return this.container.querySelector<HTMLInputElement>('[name="itemSearchInput"]')
    }

    private getCategoriesSelect(): HTMLSelectElement {
        return this.container.querySelector('[name="categoriesSelect"]');
    }

    /**
     * @returns all the categories, which are used in the items - array
     */
    private getCategories(items: Item[]): string[] {
        return Array.from(
            new Set(
                items.map(item => item.category)
            )
        );
    }

    /**
     * inserts the items, which are not filtered by the
     * itemSearchInput.
     */
    private insertItems(items: Item[]) {
        const select = this.getItemSelectInput();
        for (const item of items) {
            const { value } = this.getItemSearchInput();
            if (!value || item.name.toLowerCase().includes(value.toLowerCase())) {
                const { category } = item;
                const optgroup = select.querySelector(`${this.optgroupTagName}[label="${category}"]`);
                const option = this.getOption(item.name);
                optgroup.appendChild(option);
            }
        }
    }

    /**
     * Deletes all the current optgroups first.
     * Then appends all the optgroups with the category - names
     * of all the items.
     * Additionally inserts all the items, which should be visible in the optgroups.
     * When some filters are active currently, this filters will be applied.
     */
    private appendOptgroupsAndCategories(items: Item[]): void {
        const select = this.getItemSelectInput();
        // remove current optgroups
        const optgroups = select.querySelectorAll(this.optgroupTagName);
        optgroups.forEach(optgroup => optgroup.remove());
        // now add all the categories
        const categories = this.getCategories(items)
        categories.forEach(category => {
            const optgroup = document.createElement(this.optgroupTagName);
            optgroup.label = category;
            select.appendChild(optgroup);
        });
        this.insertItems(items);
        // filter the categories by removing the optgroups, which should not be shown
        const { value } = this.getCategoriesSelect();
        if (value != this.defaultOptionValue) {
            const select = this.getItemSelectInput();
            const optGroups = select.querySelectorAll<HTMLOptGroupElement>(`${this.optgroupTagName}:not([label="${value}"])`);
            optGroups.forEach(optGroup => optGroup.remove());
        }
    }

    private initializeCategoryFilter(items: Item[]) {
        const categoriesSelect = this.getCategoriesSelect();
        const defaultOption = this.getOption(this.defaultOptionValue);
        categoriesSelect.append(defaultOption);
        for (const category of this.getCategories(items)) {
            const option = this.getOption(category);
            categoriesSelect.appendChild(option);
        }
        categoriesSelect.onchange = () => {
            this.appendOptgroupsAndCategories(items);
        }
    }

    private getOption(value: string): HTMLOptionElement {
        const option = document.createElement('option');
        option.innerText = option.value = value;
        return option;
    }

    private initializeItemFilter(items: Item[]) {
        const searchInput = this.getItemSearchInput();
        searchInput.onkeyup = () => {
            this.appendOptgroupsAndCategories(items);
        }
    }

    private initializeFilters(items: Item[]) {
        this.initializeCategoryFilter(items);
        this.initializeItemFilter(items);
    }

    /**
     * links the form with the input - fields, which
     * are not directly in the form.
     */
    private setFormIdForInput() {
        const formId = UniqueUtilities.getNextId();
        const form = this.getForm();
        form.id = formId;
        const searchInput = this.getItemSearchInput();
        searchInput.setAttribute('form', formId);
    }

    /**
     * Adds the items to the list, which were already added
     * beforehand.
     */
    private addCurrentItems() {
        const { currentItems } = this.componentParameters;
        currentItems.forEach(item => {
            const { itemName, quantity } = item;
            this.addItemToList(itemName, quantity);
        });
    }

    private async initializeItemCollection() {
        const items = await this.getItems();
        this.initializeFilters(items);
        this.appendOptgroupsAndCategories(items);
        this.setFormIdForInput();
        this.initializeFormSubmit(items);
        this.addCurrentItems();
    }

    /**
     * adds an item to the list. Creates..
     * - The delete - button
     * - The quantity input - field
     * - An paragraph with the name of the item.
     */
    private addItemToList(itemName: string, quantity = 1) {
        const itemsContainer = this.getItemsContainer();
        const p = document.createElement('p');
        p.classList.add('itemWithQuantityAndDeleteButton')
        const label = document.createElement('label')
        label.innerText = itemName;
        p.appendChild(label);
        // create Number - input to change quantity
        const input = document.createElement('input');
        InputUtilities.setDefaultNumberInputAttributes(input);
        input.value = quantity.toString();
        input.title = 'Quantity';
        input.oninput = () => {
            /**
             * We are confident here and expect the quantity to be changed 100%.
             * Anyways: How would we handle a non successfull quantity - update?
             * Not sure at the moment...
             */
            if (input.validity.valid) {
                this.componentParameters.updateQuantity(itemName, parseInt(input.value));
            }
        }
        p.prepend(input);
        // create delete - button
        const deleteButton = HtmlUtilities.getRootNode<HTMLButtonElement>(itemCollectionPartials.deleteButton);
        deleteButton.onclick = async () => {
            const removed = await this.componentParameters.removeItem(itemName);
            if (removed) {
                p.remove();
            }
        }
        p.prepend(deleteButton);
        // append the item to the itemsContainer
        itemsContainer.appendChild(p);
    }

    private initializeFormSubmit(items: Item[]) {
        const form = this.getForm();
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const itemName = formData.get('item') as string;
            const insertSuccessful = await this.componentParameters.insertItem(itemName);
            if (insertSuccessful) {
                // insert item into the list.
                this.addItemToList(itemName)
                const searchInput = this.getItemSearchInput();
                searchInput.value = '';
                this.appendOptgroupsAndCategories(items);
            } else {
                DialogUtilities.alert(`The item is already in the list. When you want to add more of "${itemName}", try to change the quantity.`)
            }
        }
    }
}