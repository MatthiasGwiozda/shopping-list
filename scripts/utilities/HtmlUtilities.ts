
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
     * creates html tags based on the length of the given content.
     * The content will be safely inserted. Html in the content will be rendered as
     * string.
     */
    static makeHtmlElementsFromContent(contents: string[], htmlTag: string): string {
        let elements = '';
        for (const content of contents) {
            elements += `<${htmlTag}>${HtmlUtilities.getAsHtmlString(content)}</${htmlTag}>`;
        }
        return elements
    }
}
