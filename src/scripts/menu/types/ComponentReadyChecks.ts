export type ComponentReadyCheck = () => Promise<boolean>;

type ComponentReadyChecks = {
    [key: string]: ComponentReadyCheck;
};

export default ComponentReadyChecks;
