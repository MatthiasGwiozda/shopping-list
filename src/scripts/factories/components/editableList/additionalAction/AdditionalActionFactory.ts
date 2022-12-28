import Component from "../../../../components/Component";

export default interface AdditionalActionFactory<EditableListElement> {
    getComponent(container: HTMLElement, param: EditableListElement): Component
}
