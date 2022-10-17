import { join } from 'path';
/**
 * When some paths are changing in the application, they can be switched
 * through this class which for example handles the place of the root path.
 */
export default abstract class PathUtilities {
    /**
     * @returns the root path of the application. This is where the `package.json` is positioned.
     */
    private static getRootPath(): string {
        return join(__dirname, '../../../');
    }

    /**
     * @param path the path, for the file or folder. When writing a path, you should always
     * start from where the package.json is positioned.
     * @returns the path for the file relative from the root - path of the application
     */
    static getPath(path: string): string {
        return join(this.getRootPath(), path);
    }
}
