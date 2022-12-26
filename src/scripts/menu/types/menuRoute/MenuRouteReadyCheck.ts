import { ComponentReadyCheck } from "../readyCheck/ComponentReadyChecks";

export default interface MenuRouteReadyCheck {
    checks: ComponentReadyCheck[];
    message: string;
}
