import CategoryDao from "../../../../database/dataAccessObjects/category/CategoryDao";

export default interface CategoryDaoFactory {
    getCategoryDao(): Promise<CategoryDao>;
}
