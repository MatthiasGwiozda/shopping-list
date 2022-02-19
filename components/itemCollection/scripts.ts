import Database from "../../scripts/Database";
import RandomUtilities from "../../scripts/utilities/RandomUtilities";
import { Components } from "../../types/components/Components";
import Item from "../../types/Item";
import Component from "../Component";

export default class ItemCollection extends Component<Components.itemCollection> {
    private readonly optgroupTagName = 'optgroup';

    rendered() {
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
     * Deletes all the current optgroups first.
     * Then appends all the optgroups with the category - names
     * of all the items.
     * Additionally inserts all the items, which should be visible in the optgroups.
     */
    private appendOptgroups(items: Item[]): void {
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
    }

    private getOption(value: string): HTMLOptionElement {
        const option = document.createElement('option');
        option.innerText = option.value = value;
        return option;
    }

    private insertItems(items: Item[]) {
        const select = this.getItemSelectInput();
        for (const item of items) {
            const { category } = item;
            const optgroup = select.querySelector(`${this.optgroupTagName}[label="${category}"]`)
            const option = this.getOption(item.name)
            optgroup.appendChild(option);
        }
    }

    private initializeFilter(items: Item[]) {
        const categoriesSelect = this.container.querySelector<HTMLSelectElement>('[name="categoriesSelect"]');
        const defaultOptionValue = 'show all categories';
        const defaultOption = this.getOption(defaultOptionValue)
        categoriesSelect.append(defaultOption);
        for (const category of this.getCategories(items)) {
            const option = this.getOption(category);
            categoriesSelect.appendChild(option);
        }
        categoriesSelect.onchange = () => {
            const { value } = categoriesSelect;
            this.appendOptgroups(items);
            // remove the optgroups, which should not be shown
            if (value != defaultOptionValue) {
                const select = this.getItemSelectInput();
                const optGroups = select.querySelectorAll<HTMLOptGroupElement>(`${this.optgroupTagName}:not([label="${value}"])`);
                optGroups.forEach(optGroup => optGroup.remove());
            }
        }
    }

    /**
     * links the form with the input - fields, which
     * are not directly in the form.
     */
    private setFormIdForInput() {
        const formId = RandomUtilities.getRandomNumberString();
        const form = this.getForm();
        form.id = formId;
        const searchInput = this.getItemSearchInput();
        searchInput.setAttribute('form', formId);
    }

    private async initializeItemCollection() {
        const items = await this.getItems();
        this.appendOptgroups(items);
        this.initializeFilter(items);
        this.setFormIdForInput();
        this.initializeFormSubmit();
    }

    private initializeFormSubmit() {
        const form = this.getForm();
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const item = formData.get('item') as string;
            const insertSuccessful = await this.componentParameters.insertItem(item);
            if (insertSuccessful) {
                // insert item into the list.
                const itemsContainer = this.getItemsContainer();
                const p = document.createElement('p');
                p.innerText = item;
                itemsContainer.appendChild(p);
            }
        }
    }
}