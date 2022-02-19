
export default abstract class RandomUtilities {
    static getRandomNumberString(): string {
        return (+new Date()).toString();
    }
}
