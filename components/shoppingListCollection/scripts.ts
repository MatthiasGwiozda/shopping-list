import constants from "../../scripts/constants";
import Database from "../../scripts/Database";
import DialogUtilities from "../../scripts/utilities/DialogUtilities";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class ShoppingListCollection extends Component<Components.shoppingListCollection> {
    rendered() {
        this.initializeAddListAction();
    }

    private createParagraph() {
        return document.createElement('p');
    }

    private createEditButton(shoppingListName: string, shoppingListParagraph: HTMLParagraphElement): HTMLButtonElement {
        const editButton: HTMLButtonElement = this.gethtmlFromFile('editButton.html');
        let itemCollectionContainer: HTMLParagraphElement;
        editButton.onclick = async () => {
            editButton.classList.toggle(constants.activeActionButtonClass);
            if (itemCollectionContainer != null) {
                itemCollectionContainer.remove();
                itemCollectionContainer = null;
            } else {
                itemCollectionContainer = this.createParagraph()
                shoppingListParagraph.after(itemCollectionContainer);
                Component.injectComponent(Components.itemCollection, itemCollectionContainer, {
                    currentItems: await Database.selectShoppingListItems(shoppingListName),
                    insertItem: async (itemName) => {
                        return Database.insertItemToShoppingList(itemName, shoppingListName);
                    },
                    removeItem: async (itemName) => {
                        return Database.deleteItemFromShoppingList(itemName, shoppingListName);
                    },
                    updateQuantity: async (itemName, quantity) => {
                        return Database.updateShoppingListItemQuantity(itemName, shoppingListName, quantity);
                    }
                });
            }
        }
        return editButton;
    }

    private createActiveToggler(shoppingListName: string, currentlyActive: boolean): HTMLInputElement {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentlyActive;
        checkbox.onchange = () => {
            Database.updateShoppingListActiveState(shoppingListName, checkbox.checked);
        }
        return checkbox;
    }

    private addNewList(shoppingListName: string, activeList: boolean) {
        const container = this.container.querySelector('.shoppingListWrapper');
        const p = this.createParagraph();
        const label = document.createElement('label');
        label.innerText = shoppingListName;
        const editButton = this.createEditButton(shoppingListName, p);
        const activeToggler = this.createActiveToggler(shoppingListName, activeList);
        p.append(label, editButton, activeToggler);
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