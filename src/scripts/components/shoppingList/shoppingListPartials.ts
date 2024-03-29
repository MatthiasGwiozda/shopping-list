const shoppingListPartials = {
    template: `
    <div class="shoppingLists">
        <div class="mealsList">
            <h1>Meals</h1>
            <div class="container"></div>
        </div>
        <div class="staticList">
            <h1>Static Lists</h1>
            <div class="container"></div>
        </div>
    </div>
    <h1>Generation</h1>
    <div class="shoppingListGeneration">
        <select class="shops"></select>
        <button class="default">Generate Shoppinglist</button>
        <div class="textAreasContainer"></div>
    </div>
    `
}

export default shoppingListPartials;
