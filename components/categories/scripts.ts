import ComponentUtilities from "../../scripts/utilities/ComponentUtilities";
import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class Categories extends Component<Components.categories> {
    rendered() {
        this.createEditableList();
    }
    // create editableList for categories
    private createEditableList() {
        ComponentUtilities.injectComponent(
            Components.editableList,
            this.container.querySelector<HTMLElement>("#categoriesList")
        );
    }
}
