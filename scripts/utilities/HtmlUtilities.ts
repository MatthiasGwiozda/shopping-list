import FileUtilities from "./FileUtilities";

export default abstract class HtmlUtilities {
    /**
     * @param untrustedHtml a text - component, which may have html reserved elements (<>)
     * @returns a string, which can safely be inserted into the
     * innerHtml of a Html - element.
     */
    static getAsHtmlString(untrustedHtml: string): string {
        const el = document.createElement('div');
        el.innerText = untrustedHtml;
        return el.innerHTML;
    }

    /**
     * @returns an HTMLElement with the given innerText
     */
    static createElement<K extends HTMLElement>(htmlTag: string, innerText: string): K {
        const el = document.createElement(htmlTag);
        el.innerHTML = this.getAsHtmlString(innerText);
        return el as K;
    }

    /**
     * creates html tags based on the length of the given content.
     * The content will be safely inserted. Html in the content will be rendered as
     * string.
     */
    static makeHtmlElementsFromContent(contents: string[], htmlTag: string): HTMLElement[] {
        let elements: HTMLElement[] = [];
        for (const content of contents) {
            elements.push(this.createElement(htmlTag, content));
        }
        return elements
    }

    /**
     * @param file the relative path of the html - file from the project root - directory.
     * This function uses the function `FileUtilities.getFileContent` to pick up the html - file.
     * @returns a container, which includes the html elements in the file.
     * When the file has multiple "root" elements, you can decide yourself, which
     * html - elements you want to use through the container.
     */
    static getFileAsHtmlElement(file: string): HTMLElement {
        const div = document.createElement('div');
        div.innerHTML = FileUtilities.getFileContent(file);
        return div;
    }
}
