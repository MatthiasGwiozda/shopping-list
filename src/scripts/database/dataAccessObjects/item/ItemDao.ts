import Item from "../../../types/Item";

export default interface ItemDao {
    selectAllItems(): Promise<Item[]>;
}
