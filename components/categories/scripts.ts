import ComponentUtilities, { Components } from "../../scripts/utilities/ComponentUtilities";
import Component from "../Component";

export default class Categories extends Component {
    constructor(container: HTMLElement) {
        super(container);
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
