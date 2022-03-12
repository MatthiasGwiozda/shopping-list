
export default abstract class InputUtilities {

    /**
     * Sets the default attributes for a number input.
     */
    static setDefaultNumberInputAttributes(input: HTMLInputElement) {
        input.type = 'number';
        input.min = "1";
        input.max = "999999"
    }
}
