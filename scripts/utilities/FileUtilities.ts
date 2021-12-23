import { readFileSync, existsSync } from 'fs'
import PathUtilities from './PathUtilities';

/**
 * all the files, which can be accessed through
 * the FileUtilities.
 * The filenames must be unique!
 */
export enum Files {
    structureSql = 'structure.sql',
    database = 'groceryList.db'
}

export default class FileUtilities {

    private static getFilePath(file: Files): string {
        const filePath: { [key in Files]: string } = {
            [Files.database]: Files.database,
            [Files.structureSql]: 'sql/' + Files.structureSql,
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
