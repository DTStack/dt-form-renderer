import FnExpressionTransformer from "../fnExpressionTransformer";

describe('Function Transformer Tests', () => {
    const expressionParser = new FnExpressionTransformer()

    test('Is Transformed Function Properly', () => {
        const scope = {
            formData: {
                x: 1
            },
            extraDataRef: {
                current: {
                    y: 2
                }
            }
        };
        const fn = expressionParser.generateFn('formData.x + extraData.y');
        const res = fn(scope);
        expect(res).toBe(3)
    });

});