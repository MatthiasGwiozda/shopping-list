import ObserverableComponent from "../../../../components/ObserverableComponent";

export default interface ObserverableMenuComponentFactory {
    getComponent(container: HTMLElement): ObserverableComponent;
}
