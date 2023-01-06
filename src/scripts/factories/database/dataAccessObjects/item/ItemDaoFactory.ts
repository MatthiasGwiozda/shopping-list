import ItemDao from "../../../../database/dataAccessObjects/item/ItemDao";

export default interface ItemDaoFactory {
    getDao(): ItemDao;
}
