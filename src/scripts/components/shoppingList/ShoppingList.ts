import { ShopAccessObject, ShoppingListAccessObject } from "../../database/dataAccessObjects/AccessObjects";
import ShoppingListCollectionFactory from "../../factories/components/shoppingListCollection/ShoppingListCollectionFactory";
import Component from "../Component";
import MealCollectionFactory from "../mealCollection/MealCollectionFactory";
import shoppingListPartials from "./shoppingListPartials";

enum TextAreas {
    availableItemsInShop = 'availableItemsInShop',
    unavailableItemsInShop = 'unavailableItemsInShop',
    recipe = 'recipe'
}

export interface ShoppingListDeps {
    shoppingListCollectionFactory: ShoppingListCollectionFactory;
    mealCollectionFactory: MealCollectionFactory;
    shopAccessObject: ShopAccessObject;
    shoppingListAccessObject: ShoppingListAccessObject;
}

export default class ShoppingList extends Component {

    private static readonly textAreaHeadlines: { [key in TextAreas]: string } = {
        availableItemsInShop: 'Available items in selected shop',
        unavailableItemsInShop: 'Items, which can\'t be bought in this shop',
        recipe: 'Recipes'
    }

    constructor(container: HTMLElement, private deps: ShoppingListDeps) {
        super(container);
        this.rendered()
    }

    protected getHtmlTemplate(): string {
        return shoppingListPartials.template
    }

    private rendered() {
        const mealCollectionContainer = this.container.querySelector<HTMLElement>(".mealsList .container");
        this.deps.mealCollectionFactory.create(mealCollectionContainer);
        const shoppingListCollectionContainer = this.container.querySelector<HTMLElement>(".staticList .container");
        this.deps.shoppingListCollectionFactory.create(shoppingListCollectionContainer)
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
        const shops = await this.deps.shopAccessObject.selectAllShops();
        for (const shop of shops) {
            const option = document.createElement('option');
            option.value = shop.shop_id.toString();
            option.innerText = `${shop.shop_name} | ${shop.street} ${shop.house_number} ${shop.postal_code}`;
            select.append(option);
        }
        button.onclick = async () => {
            const shopId = parseInt(select.value);
            const shoppingListAccessObject = this.deps.shoppingListAccessObject;
            const shoppingListAvailableInShop = await shoppingListAccessObject.generateShoppingList(shopId, true);
            const shoppingListUnAvailableInShop = await shoppingListAccessObject.generateShoppingList(shopId, false);
            const recipe = await this.deps.shoppingListAccessObject.getRecipesOfSelectedMeals();
            this.setTextAreaValue(TextAreas.availableItemsInShop, shoppingListAvailableInShop);
            this.setTextAreaValue(TextAreas.unavailableItemsInShop, shoppingListUnAvailableInShop);
            this.setTextAreaValue(TextAreas.recipe, recipe);
        }
    }
}