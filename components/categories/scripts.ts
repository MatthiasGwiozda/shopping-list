import EditableList from "../../elements/editableList/scripts";

// create editableList for categories
function createEditableList() {
    const editableListContainer = document.getElementById("categoriesList");
    new EditableList().insertEditableList(editableListContainer);
}
createEditableList();
