
export default abstract class UniqueUtilities {
    static lastId = 0;

    static getNextId(): string {
        UniqueUtilities.lastId++;
        return (UniqueUtilities.lastId).toString();
    }
}
