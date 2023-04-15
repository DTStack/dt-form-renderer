import FnExpressionTransformer from '../fnExpressionTransformer';
describe('Function Transformer Tests', () => {
    const expressionParser = new FnExpressionTransformer();
    const scope = {
        formData: {
            x: 1,
        },
        extraDataRef: {
            current: {
                serviceLoading: {},
                y: 2,
                arr: [1, 2, 3],
            },
        },
    };

    test('Is Transformed Function Properly', () => {
        const fn = expressionParser.transform('formData.x + extraData.y');
        const res = fn(scope);
        expect(res).toBe(3);

        const reduceFn = expressionParser.transform(
            'extraData.arr.includes(1)',
        );
        const flag = reduceFn(scope);
        expect(flag).toBe(true);
    });

    test('Is Access Global Env', () => {
        const winFn = expressionParser.transform('window');
        const win = winFn(scope);
        expect(win).toBe(undefined);
        expect(window).not.toBeNull();

        const docFn = expressionParser.transform('document');
        const doc = docFn(scope);
        expect(doc).toBe(undefined);
        expect(document).not.toBeNull();
    });

    test('Is Access Math And Date', () => {
        const dateFn = expressionParser.transform('Date.now()');
        const now = dateFn(scope);
        expect(typeof now).toBe('number');
        expect(Date).not.toBeNull();

        const mathFn = expressionParser.transform('Math.floor(1.22)');
        const num = mathFn(scope);
        expect(num).toBe(1);
        expect(Math).not.toBeNull();
    });
});
