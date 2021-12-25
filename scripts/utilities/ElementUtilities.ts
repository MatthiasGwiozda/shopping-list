import FileUtilities, { Files } from "./FileUtilities";

export default abstract class ElementUtilities {
    /**
     * Injects the cssFile into the document
     * @param cssFile the css - file
     */
    static injectStylesToDocument(cssFile: Files) {
        const cssElement = document.createElement('link');
        cssElement.href = FileUtilities.getFilePath(cssFile);
        cssElement.rel = 'styleSheet';
        document.head.appendChild(cssElement);
    }

    /**
     * inserts the given html - File into the document.
     * @param htmlFile the file, in which the html is included
     * @param htmlElement the htmlElement, in which the "html" will be inserted.
     */
    static injectHtmlToElement(htmlFile: Files, htmlElement: HTMLElement) {
        const html = FileUtilities.getFileContent(htmlFile);
        const tempEl = document.createElement('div');
        tempEl.innerHTML = html;
        htmlElement.appendChild(tempEl.firstChild);
    }
}
