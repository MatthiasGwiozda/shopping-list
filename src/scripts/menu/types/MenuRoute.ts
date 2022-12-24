import ComponentFactory from "../../factories/components/interfaces/ComponentFactory";
import { ComponentReadyCheck } from "./ComponentReadyChecks";

export default interface MenuRoute {
    name: string;
    componentFactory: ComponentFactory;
    icon: string;
    /**
     * you can define, which component is
     * dependent of another component.
     * When a dependent component is not ready, the menu - item
     * will be displayed "disabled" to show the user that he
     * cannot use this section without defining other elements.
     */
    componentReadyChecks?: ComponentReadyCheck[];
    /**
     * This message will be set as the title of the
     * menu - item when the menu - item is not ready to be used.
     */
    componentReadyCheckMessage?: string;
}
