import ComponentReadyCheck from "../readyCheck/ComponentReadyCheck";

export default interface MenuRouteReadyCheck {
    checks: ComponentReadyCheck[];
    message: string;
}
