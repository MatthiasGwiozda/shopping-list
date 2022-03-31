import { v4 as uuidv4 } from 'uuid';

export default abstract class RandomUtilities {
    static getRandomNumberString(): string {
        return uuidv4();
    }
}
