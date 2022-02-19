import Item from "../Item";

export default interface ItemCollectionParams {
    /**
     * a filter, which decides, which item will be editable in
     * the itemCollection. When the function returns true,
     * the item will be shown in the itemCollection.
     * When no filter is used, all items will be shown.
     */
    filter?: (item: Item) => boolean;
    /**
     * this function is called then an item was added to the list.
     * The quantity is expected to be 1 per default. There is no possibility to change the
     * quantity when inserting an item. The quantity can be changed
     * with the function updateQuantity.
     * @returns true, if the item could successfully be added in the context,
     * false otherwise.
     */
    insertItem: (itemName: string) => Promise<boolean>;
    /**
     * Is called when an item should be removed from the list.
     * the boolean return - value indicates if the deletion was
     * successful or not.
     */
    removeItem: (itemName: string) => Promise<boolean>;
    /**
     * this function will be called when the quantity of an item
     * changes.
     */
    updateQuantity: (itemName: string, quantity: number) => Promise<boolean>;
    /**
     * The items, which were already added to the itemCollection.
     */
    currentItems: {
        itemName: string;
        quantity: number;
    }[];
}
