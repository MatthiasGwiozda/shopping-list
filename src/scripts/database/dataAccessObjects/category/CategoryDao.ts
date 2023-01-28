import Category from "../../../types/Category";

export default interface CategoryDao {
    selectAllCategories(): Promise<Category[]>;
}
