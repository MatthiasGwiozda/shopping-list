import { Components } from '../../types/components/Components';

type ReadyCheckComponents = Components.categories | Components.shops | Components.items | "itemsWithFoodCheck";

export type ComponentReadyCheck = () => Promise<boolean>;

type ComponentReadyChecks = {
    [key in ReadyCheckComponents]: ComponentReadyCheck;
};

export default ComponentReadyChecks;
