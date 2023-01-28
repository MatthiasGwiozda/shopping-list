import ComponentReadyCheck from "./ComponentReadyCheck";

type ReadyCheckReturnType = ReturnType<ComponentReadyCheck>;

interface ComponentReadyChecks
    extends ItemsReadyCheck,
    CategoriesReadyCheck,
    ShopsReadyCheck,
    ItemsWithFoodReadyCheck { };

export interface ShopWithItemsReadyChecks
    extends ShopsReadyCheck, ItemsReadyCheck { }

export interface CategoriesReadyCheck {
    categories(): ReadyCheckReturnType;
}

export interface ItemsWithFoodReadyCheck {
    itemsWithFood(): ReadyCheckReturnType;
}

interface ShopsReadyCheck {
    shops(): ReadyCheckReturnType;
}

interface ItemsReadyCheck {
    items(): ReadyCheckReturnType;
}

export default ComponentReadyChecks;
