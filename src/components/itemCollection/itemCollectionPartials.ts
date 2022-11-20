
const itemCollectionPartials = {
    template: `
    <div class="itemCollection">
        <div class="items">

        </div>
        <div class="itemSelector">
            <form>
                <label>
                    <span>Select item</span>
                    <select name="item" required="true"></select>
                </label>
                <button type="submit">
                    Add Item ➕
                </button>
            </form>
            <div class="filter">
                <label>
                    <span>Filter item</span>
                    <input type="text" name="itemSearchInput" />
                </label>
                <label>
                    <span>Filter category</span>
                    <select name="categoriesSelect"></select>
                </label>
            </div>
        </div>
    </div>
    `,
    deleteButton: `<button class="danger square" title="delete">🚮</button>`
}

export default itemCollectionPartials
