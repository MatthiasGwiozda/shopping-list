import CategoryDao from "../../../../database/dataAccessObjects/category/CategoryDao";

export default interface CategoryDaoFactory {
    getDao(): CategoryDao;
}
