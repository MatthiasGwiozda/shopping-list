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
}
