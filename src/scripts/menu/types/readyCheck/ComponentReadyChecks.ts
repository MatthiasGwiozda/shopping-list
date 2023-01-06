import ComponentReadyCheck from "./ComponentReadyCheck";

type ReadyCheckReturnType = ReturnType<ComponentReadyCheck>;

interface ComponentReadyChecks
    extends ItemsReadyCheck,
    CategoriesReadyCheck,
    ShopsReadyCheck,
    ItemsWithFoodReadyCheck { };

export interface ShopWithItemsReadyChecks
    extends ShopsReadyCheck, ItemsReadyCheck { }

interface ItemsReadyCheck {
    items(): ReadyCheckReturnType;
}

export interface CategoriesReadyCheck {
    categories(): ReadyCheckReturnType;
}

interface ShopsReadyCheck {
    shops(): ReadyCheckReturnType;
}

export interface ItemsWithFoodReadyCheck {
    itemsWithFood(): ReadyCheckReturnType;
}

export default ComponentReadyChecks;
