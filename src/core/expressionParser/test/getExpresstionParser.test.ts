import GetExpressionParser from "../getExpressionParser";

describe('Get Expression Parser Tests', () => {
    const getExpressionParser = new GetExpressionParser()
    const extraData = {
        x: {
            y: 'ok'
        }
    }
    const expr1 = "{{ extraData.x.y }}"
    const expr2 = "{{formData.x.y}}"
    const expr3 = "{{extrDta.x.y}}"

    const ruleMap = {
        validators: {
            formJsonValidator: 'formJsonValidator',
        },
        customRules: {
            noWhiteSpace: (formData, extraData) => 'noWhiteSpace',
        },
    }
    const validatorExpr1 = "{{ruleMap.validators.formJsonValidator }}"
    const validatorExpr2 = "{{  ruleMap.customRules.noWhiteSpace }}"
    const validatorExpr3 = "{{ ruleMap.customRuls.x }}"
    const validatorExpr4 = "{{ ruleap.customRuls.y }}"


    test('Contain Get Expression test', () => {
        const flag1 = GetExpressionParser.containGetExpression(expr1)
        expect(flag1).toBe(true)

        const flag2 = GetExpressionParser.containGetExpression(expr2)
        expect(flag2).toBe(true)

        const flag3 = GetExpressionParser.containGetExpression(expr3)
        expect(flag3).toBe(false)
    });

    test('Generate Value Description From Expression', () => {
        const valueDesc = getExpressionParser.genValueDescFromExpression(expr1)
        expect(valueDesc.source).toBe('extraData')
        expect(valueDesc.property).toEqual(['x', 'y'])
    });

    test("Generate Value Getter", () => {
        const getter = getExpressionParser.genValueGetter(expr1)
        const res = getter.call(null, {}, extraData)
        expect(res).toBe('ok')
    })

    test("Contain Validator Expression", () => {
        const flag1 = GetExpressionParser.containValidatorExpression(validatorExpr1)
        expect(flag1).toBe(true)

        const flag2 = GetExpressionParser.containValidatorExpression(validatorExpr2)
        expect(flag2).toBe(true)

        const flag3 = GetExpressionParser.containValidatorExpression(validatorExpr3)
        expect(flag3).toBe(false)

        const flag4 = GetExpressionParser.containValidatorExpression(validatorExpr4)
        expect(flag3).toBe(false)
    })

    test("Generate Validator Description From Expression", () => {
        const validatorDesc = getExpressionParser.genValidatorDescFromExpression(validatorExpr1)
        expect(validatorDesc.source).toBe('ruleMap')
        expect(validatorDesc.type).toBe('validators')
        expect(validatorDesc.property).toEqual(['formJsonValidator'])
    })


    test("Generate Validator Getter", () => {
        const getter1 = getExpressionParser.genValidatorGetter(ruleMap, validatorExpr1)
        const res1 = getter1.call(null, {}, extraData)
        expect(res1).toBe('formJsonValidator')

        const getter2 = getExpressionParser.genValidatorGetter(ruleMap, validatorExpr2)
        const res2 = getter2.call(null, {}, extraData)
        expect(res2).toBe('noWhiteSpace')

    })
});
