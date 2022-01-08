import { Components } from "../../types/components/Components";
import Component from "../Component";

export default class editableListSortableCategories extends Component<Components.editableListSortableCategories> {
    rendered() {
        console.log(this.componentParameters);
    }
}