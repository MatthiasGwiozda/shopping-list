import Component from "../../../../components/Component";

export default interface ComponentFactory {
    getComponent(container: HTMLElement): Component;
}
