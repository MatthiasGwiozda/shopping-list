import { readFileSync, existsSync } from 'fs'
import PathUtilities from './PathUtilities';

/**
 * all the files, which can be accessed through
 * the FileUtilities.
 * The filenames must be unique!
 */
export enum Files {
    structureSql = 'structure.sql',
    database = 'groceryList.db',
    editableListHtml = 'editableList.html',
    editableListstyles = 'editableListstyles.css'
}

export default class FileUtilities {

    public static getFilePath(file: Files): string {
        const editableListPath = 'elements/editableList/';
        const filePath: { [key in Files]: string } = {
            [Files.database]: Files.database,
            [Files.structureSql]: 'sql/' + Files.structureSql,
            [Files.editableListHtml]: editableListPath + Files.editableListHtml,
            [Files.editableListstyles]: editableListPath + Files.editableListstyles,
        }
        return PathUtilities.getPath(filePath[file]);
    }

    static getFileContent(file: Files): string {
        const filePath = FileUtilities.getFilePath(file);
        if (existsSync(filePath)) {
            const data = readFileSync(filePath);
            return data?.toString('utf-8');
        }
    }
}
