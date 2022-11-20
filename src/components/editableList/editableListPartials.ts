
const editableListPartials = {
    template: `
    <div class="editableListWrapper">
        <div class="topActionContainer"></div>
        <table class="editable-list">
            <thead>
                <tr>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="bottomActionContainer"></div>
    </div>
    `,
    additionalActionButton: `<button class="default square additionalActionButton"></button>`,
    addNewButton: `<button class="default" title="Add a new element. You may use ctrl + n to create new elements">Add new ➕</button>`,
    cancelButton: `<button class="warn square" title="Cancel. You may use Esc to cancel">❌</button>`,
    deleteButton: `<button class="danger square" title="delete">🚮</button>`,
    editAllButton: `<button class="default" title="Edit all elements. Remember to save the items, which you have changed">Edit all elements ✏</button>`,
    editButton: `<button class="default square editItemButton" title="edit">✏</button>`,
    saveAllButton: `<button class="success">Save all Elements 💾</button>`,
    saveButton: `<button class="success square saveItemButton" type="submit" title="save">💾</button>`,
    searchInput: `<input type="text" placeholder="filter" />`
}

export default editableListPartials
