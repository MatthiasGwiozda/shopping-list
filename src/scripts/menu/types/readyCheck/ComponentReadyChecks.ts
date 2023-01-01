import ComponentReadyCheck from "./ComponentReadyCheck";

type ReadyCheckReturnType = ReturnType<ComponentReadyCheck>;

interface ComponentReadyChecks {
    categories(): ReadyCheckReturnType;
    shops(): ReadyCheckReturnType;
    items(): ReadyCheckReturnType;
    itemsWithFood(): ReadyCheckReturnType;
};

export default ComponentReadyChecks;
