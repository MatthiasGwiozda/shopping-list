import ElementUtilities from "../../scripts/utilities/ElementUtilities";
import { Files } from "../../scripts/utilities/FileUtilities";

export default class EditableList {

    insertEditableList(htmlElement: HTMLElement) {
        // first insert styles
        ElementUtilities.injectStylesToDocument(Files.editableListstyles);
        // now insert the html
        ElementUtilities.injectHtmlToElement(Files.editableListHtml, htmlElement);
    }
}
