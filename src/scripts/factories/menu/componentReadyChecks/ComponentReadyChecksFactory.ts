import ComponentReadyChecks from "../../../menu/types/readyCheck/ComponentReadyChecks";

export default interface ComponentReadyChecksFactory {
    getReadyChecks(): ComponentReadyChecks;
}
