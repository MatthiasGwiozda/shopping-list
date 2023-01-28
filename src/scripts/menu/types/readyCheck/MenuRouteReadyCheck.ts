import ComponentReadyCheck from "./ComponentReadyCheck";

export default interface MenuRouteReadyCheck {
    checks: ComponentReadyCheck[];
    message: string;
}
