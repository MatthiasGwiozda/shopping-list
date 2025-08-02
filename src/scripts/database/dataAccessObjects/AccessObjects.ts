import Category from "../../types/Category";

export interface CategoryAccessObject {
    selectAllCategories(): Promise<Category[]>;
    deleteCategory(categoryObject: Category): Promise<boolean>;
    insertCategory(categoryObject: Category): Promise<boolean>;
    updateCategory(oldCategory: Category, newCategory: Category): Promise<boolean>;
}
