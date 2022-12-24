import { ComponentReadyCheck } from "./ComponentReadyChecks";

export default interface MenuRouteReadyCheck {
    checks: ComponentReadyCheck[];
    message: string;
}
