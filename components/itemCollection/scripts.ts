import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import Item from "../../types/Item";
import Component from "../Component";

export default class ItemCollection extends Component<Components.itemCollection> {
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

    private getSelectInput(): HTMLSelectElement {
        return this.container.querySelector('select');
    }

    private getItemsContainer() {
        return this.container.querySelector('.items');
    }

    private appendOptgroups(select: HTMLSelectElement, items: Item[]) {
        const categories = Array.from(
            new Set(
                items.map(item => item.category)
            )
        );
        categories.forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            select.appendChild(optgroup);
        })
    }

    private async initializeItemCollection() {
        const items = await this.getItems();
        const selectInput = this.getSelectInput();
        this.appendOptgroups(selectInput, items);
        for (const item of items) {
            const { category } = item;
            const optgroup = selectInput.querySelector(`optgroup[label="${category}"]`)
            const option = document.createElement('option');
            option.innerText = option.value = item.name;
            optgroup.appendChild(option);
        }
        this.initializeFormSubmit();
    }

    private initializeFormSubmit() {
        const form = this.container.querySelector('form');
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