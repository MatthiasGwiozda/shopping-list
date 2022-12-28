
export default abstract class Component {

    constructor(
        protected container: HTMLElement
    ) {
        this.injectHtmlToElement();
    }
    
    protected abstract getHtmlTemplate(): string;
    
    private injectHtmlToElement() {
        this.container.innerHTML = this.getHtmlTemplate();
    }
}
