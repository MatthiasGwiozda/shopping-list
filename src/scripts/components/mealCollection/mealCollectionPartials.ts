
const mealCollectionPartials = {
    template: `
    <div class="mealCollection">
        <!-- Container for all the meals, which were added to the list -->
        <div class="meals"></div>
        <form class="mealsPicker">
            <select></select>
            <button class="default" type="submit">Add Meal ➕</button>
        </form>
    </div>
    `,
    item: `<p class="itemWithQuantityAndDeleteButton">
    <button class="danger square" title="delete">🚮</button>
    <input />
    <label></label>
</p>`
}

export default mealCollectionPartials;
