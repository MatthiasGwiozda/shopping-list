import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import InputUtilities from "../../scripts/utilities/InputUtilities";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class ShoppingListCollection extends Component<Components.shoppingListCollection> {
    rendered() {
        this.insertCurrentShoppingLists();
        this.initializeAddListAction();
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

    private createEditButton(label: HTMLLabelElement, shoppingListParagraph: HTMLParagraphElement): HTMLButtonElement {
        const editButton: HTMLButtonElement = this.gethtmlFromFile('editButton.html');
        let itemCollectionContainer: HTMLParagraphElement;
        editButton.onclick = async () => {
            editButton.classList.toggle(constants.activeActionButtonClass);
            if (itemCollectionContainer != null) {
                itemCollectionContainer.remove();
                itemCollectionContainer = null;
                // replace the input with the label
                const input = editButton.parentElement.querySelector('input[type="text"]');
                input.replaceWith(label);
            } else {
                this.replaceLabelWithInput(label);
                itemCollectionContainer = this.createParagraph()
                itemCollectionContainer.classList.add('itemCollectionContainer');
                shoppingListParagraph.after(itemCollectionContainer);
                Component.injectComponent(Components.itemCollection, itemCollectionContainer, {
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
                });
            }
        }
        return editButton;
    }

    private createActiveToggler(label: HTMLLabelElement, currentlyActive: boolean): HTMLInputElement {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentlyActive;
        checkbox.onchange = () => {
            Database.updateShoppingListActiveState(label.innerText, checkbox.checked);
        }
        return checkbox;
    }

    private addNewList(shoppingListName: string, activeList: boolean) {
        const container = this.container.querySelector('.shoppingListWrapper');
        const p = this.createParagraph();
        const label = document.createElement('label');
        label.innerText = shoppingListName;
        const editButton = this.createEditButton(label, p);
        const activeToggler = this.createActiveToggler(label, activeList);
        p.append(editButton, activeToggler, label);
        container.append(p);
    }

    private initializeAddListAction() {
        const form = this.container.querySelector('form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const shoppingListName = (formData.get('listName')).toString();
            const inserted = await Database.insertShoppingList(shoppingListName);
            if (inserted) {
                this.addNewList(shoppingListName, true);
            } else {
                DialogUtilities.alert('The list could not be added. Maybe it already exists');
            }
        }
    }
}