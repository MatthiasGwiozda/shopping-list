
export default abstract class InputUtilities {

    /**
     * Sets the default attributes for a number input.
     */
    static setDefaultNumberInputAttributes(input: HTMLInputElement) {
        input.type = 'number';
        input.min = "1";
        input.max = "999999"
    }

    static setDefaultTextInputAttributes(input: HTMLInputElement) {
        input.type = 'text';
        /**
         * at first there is a limit of 100 chars in every input.
         * This may change in the future.
         */
        input.maxLength = 100;
    }
}
