import Database from "../../scripts/Database";
import { Components } from "../../types/components/Components";
import Component from "../Component";

enum TextAreas {
    availableItemsInShop = 'availableItemsInShop',
    unavailableItemsInShop = 'unavailableItemsInShop',
    recipe = 'recipe'
}

export default class ShoppingList extends Component<Components.shoppingList> {

    private static readonly textAreaHeadlines: { [key in TextAreas]: string } = {
        availableItemsInShop: 'Available items in selected shop',
        unavailableItemsInShop: 'Items, which can\'t be bought in this shop',
        recipe: 'Recipe'
    }

    rendered() {
        Component.injectComponent(
            Components.mealCollection,
            this.container.querySelector(".mealsList .container")
        )
        Component.injectComponent(
            Components.shoppingListCollection,
            this.container.querySelector(".staticList .container")
        )
        this.addShoppingListGeneration();
    }

    private getShoppingListGenerationContainer() {
        return this.container.querySelector('.shoppingListGeneration');
    }

    private setTextAreaValue(textAreaName: TextAreas, value: string) {
        const textAreaContainer = this.getShoppingListGenerationContainer().querySelector('.textAreasContainer');
        let textArea: HTMLTextAreaElement = textAreaContainer.querySelector(`textarea.${textAreaName}`);
        if (textArea == null) {
            // create headline
            const headlineText = ShoppingList.textAreaHeadlines[textAreaName];
            const headline = document.createElement('h2');
            headline.innerText = headlineText;
            // create textarea
            textArea = document.createElement('textarea');
            textArea.classList.add(textAreaName);
            // append children
            textAreaContainer.append(headline, textArea);
        }
        textArea.value = value;
    }

    private async addShoppingListGeneration() {
        const shoppingListGenerationContainer = this.getShoppingListGenerationContainer();
        const button: HTMLButtonElement = shoppingListGenerationContainer.querySelector('button');
        const select = shoppingListGenerationContainer.querySelector('select');
        const shops = await Database.selectAllShops();
        for (const shop of shops) {
            const option = document.createElement('option');
            option.value = shop.shop_id.toString();
            option.innerText = `${shop.shop_name} | ${shop.street} ${shop.house_number} ${shop.postal_code}`;
            select.append(option);
        }
        button.onclick = async () => {
            const shopId = parseInt(select.value);
            const shoppingListAvailableInShop = await Database.generateShoppingList(shopId, true);
            const shoppingListUnAvailableInShop = await Database.generateShoppingList(shopId, false);
            const recipe = await Database.getRecipesOfSelectedMeals();
            this.setTextAreaValue(TextAreas.availableItemsInShop, shoppingListAvailableInShop);
            this.setTextAreaValue(TextAreas.unavailableItemsInShop, shoppingListUnAvailableInShop);
            this.setTextAreaValue(TextAreas.recipe, recipe);
        }
    }
}