
const shoppingListCollectionPartials = {
    template: `
    <div class="shoppingListCollection">
        <div class="shoppingListWrapper"></div>
        <form class="addShoppingListWrapper">
            <input type="text" name="listName" required placeholder="Shopping list name" />
            <button class="default" type="submit">Add list ➕</button>
        </form>
    </div>
    `,
    deleteButton: `<button class="danger square" title="delete">🚮</button>`,
    editButton: `<button class="default square" title="edit">✏</button>`
}

export default shoppingListCollectionPartials;
