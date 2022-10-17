import { readFileSync, existsSync } from 'fs'
import PathUtilities from './PathUtilities';

/**
 * some files, which can be accessed through
 * the FileUtilities.
 * Sometimes you may access the FileUtilities with a generated path.
 * In this case you don't need this enum.
 */
export enum Files {
    structureSql = 'src/sql/structure.sql',
    database = 'groceryList.db'
}

export default class FileUtilities {

    public static getFilePath(file: string): string {
        return PathUtilities.getPath(file);
    }

    /**
     * @param file the path of the file relative from the project root - directory.
     * @returns the content of the file.
     */
    static getFileContent(file: string): string {
        const filePath = FileUtilities.getFilePath(file);
        if (existsSync(filePath)) {
            const data = readFileSync(filePath);
            return data?.toString('utf-8');
        }
    }
}
