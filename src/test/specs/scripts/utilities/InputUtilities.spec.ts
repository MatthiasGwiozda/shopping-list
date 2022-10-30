import InputUtilities from '../../../../scripts/utilities/InputUtilities';
import { expect, test } from '@jest/globals';

describe(InputUtilities.name, function () {

    test("adds type number in default number attributes", function () {
        const htmlElementStub = {} as HTMLInputElement;
        InputUtilities.setDefaultNumberInputAttributes(htmlElementStub);
        expect(htmlElementStub.type).toEqual("number")
    })
})

