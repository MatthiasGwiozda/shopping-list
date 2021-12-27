import { readFileSync, existsSync } from 'fs'
import PathUtilities from './PathUtilities';

/**
 * all the files, which can be accessed through
 * the FileUtilities.
 * The filenames must be unique!
 */
export enum Files {
    structureSql = 'sql/structure.sql',
    database = 'groceryList.db',
    editableListHtml = 'elements/editableList/index.html',
    editableListstyles = 'elements/editableList/style.css'
}

export default class FileUtilities {

    public static getFilePath(file: Files): string {
        return PathUtilities.getPath(file);
    }

    static getFileContent(file: Files): string {
        const filePath = FileUtilities.getFilePath(file);
        if (existsSync(filePath)) {
            const data = readFileSync(filePath);
            return data?.toString('utf-8');
        }
    }
}
