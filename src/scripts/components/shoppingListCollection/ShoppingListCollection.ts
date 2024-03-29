import constants from "../../constants";
import Database from "../../database/Database";
import DialogUtilities from "../../utilities/DialogUtilities";
import InputUtilities from "../../utilities/InputUtilities";
import Component from "../Component";
import HtmlUtilities from "../../utilities/HtmlUtilities";
import shoppingListCollectionPartials from "./shoppingListCollectionPartials";
import ItemCollection from "../itemCollection/ItemCollection";
import ItemCollectionParams from "../../types/components/itemCollection";

export default class ShoppingListCollection extends Component {

    constructor(container: HTMLElement) {
        super(container);
        this.insertCurrentShoppingLists();
        this.initializeAddListAction();
    }

    protected getHtmlTemplate(): string {
        return shoppingListCollectionPartials.template
    }

    private createParagraph() {
        return document.createElement('p');
    }

    private async insertCurrentShoppingLists() {
        const shoppingLists = await Database.selectAllShoppingLists();
        for (const shoppingList of shoppingLists) {
            const { active, shoppingListName } = shoppingList;
            this.addNewList(shoppingListName, active);
        }
    }

    private replaceLabelWithInput(label: HTMLLabelElement) {
        const input = document.createElement('input');
        InputUtilities.setDefaultTextInputAttributes(input);
        input.value = label.innerText;
        input.oninput = async () => {
            const { value } = input;
            const updated = await Database.updateShoppingListName(label.innerText, value);
            // Currently there is no handling for non - successful change of the name.
            if (updated) {
                label.innerText = value;
            }
        }
        label.replaceWith(input);
    }

    private createEditButton(label: HTMLLabelElement, shoppingListParagraph: HTMLParagraphElement, deleteButton: HTMLButtonElement): HTMLButtonElement {
        const editButton: HTMLButtonElement = HtmlUtilities.getRootNode(shoppingListCollectionPartials.editButton);
        let itemCollectionContainer: HTMLParagraphElement;
        editButton.onclick = async () => {
            editButton.classList.toggle(constants.activeActionButtonClass);
            if (itemCollectionContainer != null) {
                itemCollectionContainer.remove();
                itemCollectionContainer = null;
                // replace the input with the label
                const input = editButton.parentElement.querySelector('input[type="text"]');
                input.replaceWith(label);
                deleteButton.disabled = false;
            } else {
                deleteButton.disabled = true;
                this.replaceLabelWithInput(label);
                itemCollectionContainer = this.createParagraph()
                itemCollectionContainer.classList.add('itemCollectionContainer');
                shoppingListParagraph.after(itemCollectionContainer);

                const itemCollectionParams: ItemCollectionParams = {
                    currentItems: await Database.selectShoppingListItems(label.innerText),
                    insertItem: async (itemName) => {
                        return Database.insertItemToShoppingList(itemName, label.innerText);
                    },
                    removeItem: async (itemName) => {
                        return Database.deleteItemFromShoppingList(itemName, label.innerText);
                    },
                    updateQuantity: async (itemName, quantity) => {
                        return Database.updateShoppingListItemQuantity(itemName, label.innerText, quantity);
                    }
                };
                new ItemCollection(itemCollectionContainer, itemCollectionParams);
            }
        }
        return editButton;
    }

    private createActiveToggler(label: HTMLLabelElement, currentlyActive: boolean, paragraphContainer: HTMLParagraphElement): HTMLInputElement {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentlyActive;
        checkbox.onchange = () => {
            Database.updateShoppingListActiveState(label.innerText, checkbox.checked);
            this.toggleInactiveClass(paragraphContainer);
        }
        return checkbox;
    }

    private getDeleteButton(label: HTMLLabelElement) {
        const button = HtmlUtilities.getRootNode<HTMLButtonElement>(shoppingListCollectionPartials.deleteButton);
        button.onclick = async () => {
            const confirmation = DialogUtilities.confirm(`Do you want to delete the list "${label.innerText}"?`);
            if (confirmation) {
                const deleted = await Database.deleteShoppingList(label.innerText);
                if (deleted) {
                    label.parentElement.remove();
                }
            }
        }
        return button;
    }

    private toggleInactiveClass(p: HTMLParagraphElement) {
        p.classList.toggle('inactive');
    }

    private addNewList(shoppingListName: string, activeList: boolean) {
        const container = this.container.querySelector('.shoppingListWrapper');
        const p = this.createParagraph();
        if (!activeList) {
            this.toggleInactiveClass(p);
        }
        const label = document.createElement('label');
        label.innerText = shoppingListName;
        const deleteButton = this.getDeleteButton(label);
        const editButton = this.createEditButton(label, p, deleteButton);
        const activeToggler = this.createActiveToggler(label, activeList, p);
        p.append(editButton, deleteButton, activeToggler, label);
        container.append(p);
    }

    private initializeAddListAction() {
        const form = this.container.querySelector('form');
        const input = form.querySelector('input');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const shoppingListName = (formData.get('listName')).toString();
            const inserted = await Database.insertShoppingList(shoppingListName);
            if (inserted) {
                this.addNewList(shoppingListName, true);
                input.value = '';
            } else {
                DialogUtilities.alert('The list could not be added. Maybe it already exists');
            }
        }
    }
}