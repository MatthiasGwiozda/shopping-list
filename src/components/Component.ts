
export default abstract class Component {

    constructor(
        protected container: HTMLElement
    ) {
        this.injectHtmlToElement();
    }

    private injectHtmlToElement() {
        this.container.innerHTML = this.getHtmlTemplate();
    }

    protected abstract getHtmlTemplate(): string;
}
