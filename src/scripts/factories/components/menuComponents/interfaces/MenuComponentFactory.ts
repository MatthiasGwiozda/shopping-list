import Component from "../../../../components/Component";

export default interface MenuComponentFactory {
    getComponent(container: HTMLElement): Component;
}
