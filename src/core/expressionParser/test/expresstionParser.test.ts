import ExpressionParser from "../expressionParser";

describe('Expression Parser Tests', () => {
    const expressionParser = new ExpressionParser()
    const extraData = {
        x: {
            y: 'ok'
        }
    }
    const expr1 = "{{ extraData.x.y }}"
    const expr2 = " {{extraData.x.y }}"
    const expr3 = "{{formData.x.y }}"
    const expr4 = "{{extrDta.x.y}}"
    const expr5 = "{{extrDta.x.y}}"
    const expr6 = "{{extraDta.x.y }} xxx"


    test('Is a Get Expression test', () => {
        const flag1 = ExpressionParser.isGetExpression(expr1)
        expect(flag1).toBe(true)

        const flag2 = ExpressionParser.isGetExpression(expr2)
        expect(flag2).toBe(true)

        const flag3 = ExpressionParser.isGetExpression(expr3)
        expect(flag3).toBe(true)

        const flag4 = ExpressionParser.isGetExpression(expr4)
        expect(flag4).toBe(false)

        const flag5 = ExpressionParser.isGetExpression(expr5)
        expect(flag5).toBe(false)

        const flag6 = ExpressionParser.isGetExpression(expr6)
        expect(flag6).toBe(false)
    });

    test('Generate Value Description From Expression', () => {
        const valueDesc = expressionParser.genValueDescFromExpression(expr1)
        expect(valueDesc.source).toBe('extraData')
        expect(valueDesc.property).toEqual(['x', 'y'])
    });

    test("Generate Value Getter", () => {
        const getter = expressionParser.genValueGetter(expr1)
        const res = getter.call(null, {}, extraData)
        expect(res).toBe('ok')
    })


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
    const validatorExpr4 = "{{ ruleap.customRuls.y }}sa"

    test("Is a Validator Expression", () => {
        const flag1 = ExpressionParser.isValidatorExpression(validatorExpr1)
        expect(flag1).toBe(true)

        const flag2 = ExpressionParser.isValidatorExpression(validatorExpr2)
        expect(flag2).toBe(true)

        const flag3 = ExpressionParser.isValidatorExpression(validatorExpr3)
        expect(flag3).toBe(false)

        const flag4 = ExpressionParser.isValidatorExpression(validatorExpr4)
        expect(flag4).toBe(false)
    })

    test("Generate Validator Description From Expression", () => {
        const validatorDesc = expressionParser.genValidatorDescFromExpression(validatorExpr1)
        expect(validatorDesc.source).toBe('ruleMap')
        expect(validatorDesc.type).toBe('validators')
        expect(validatorDesc.property).toEqual(['formJsonValidator'])
    })


    test("Generate Validator Getter", () => {
        const getter1 = expressionParser.genValidatorGetter(ruleMap, validatorExpr1)
        const res1 = getter1.call(null, {}, extraData)
        expect(res1).toBe('formJsonValidator')

        const getter2 = expressionParser.genValidatorGetter(ruleMap, validatorExpr2)
        const res2 = getter2.call(null, {}, extraData)
        expect(res2).toBe('noWhiteSpace')

    })

    const docsMap = {
        x: {
            y: 'doc1'
        },
        m: 'doc2'
    }
    const docsExpr1 = " {{docs.x.y}}"
    const docsExpr2 = "{{ docs.x.y }} "
    const docsExpr3 = "{{ docs.m}}"
    const docsExpr4 = "{{doc.x.y}}"
    const docsExpr5 = "{{docs.x.y}}sss"

    test("Is a Docs Expression", () => {
        const flag1 = ExpressionParser.isDocsExpression(docsExpr1)
        expect(flag1).toBe(true)

        const flag2 = ExpressionParser.isDocsExpression(docsExpr2)
        expect(flag2).toBe(true)

        const flag3 = ExpressionParser.isDocsExpression(docsExpr3)
        expect(flag3).toBe(true)

        const flag4 = ExpressionParser.isDocsExpression(docsExpr4)
        expect(flag4).toBe(false)

        const flag5 = ExpressionParser.isDocsExpression(docsExpr5)
        expect(flag5).toBe(false)
    })

    test("Generate Docs Description From Expression", () => {
        const validatorDesc = expressionParser.genDocDescFromExpression(docsExpr1)
        expect(validatorDesc.source).toBe('docs')
        expect(validatorDesc.property).toEqual(['x', 'y'])
    })


    test("Generate Docs Getter", () => {
        const res1 = expressionParser.getDoc(docsMap, docsExpr1)
        expect(res1).toBe('doc1')

        const res2 = expressionParser.getDoc(docsMap, docsExpr3)
        expect(res2).toBe('doc2')
    })

    test("Is a Docs Expression", () => {
        const fnExpr1 = " @{{ return formData.x.y}}"
        const fnExpr2 = "@ {{ return formData.x.y }} "
        const fnExpr3 = " @{{ return extraData.m }}"

        const flag1 = ExpressionParser.isFunctionExpression(fnExpr1)
        expect(flag1).toBe(true)

        const flag2 = ExpressionParser.isFunctionExpression(fnExpr2)
        expect(flag2).toBe(false)

        const flag3 = ExpressionParser.isFunctionExpression(fnExpr3)
        expect(flag3).toBe(true)
    })

    test("Generate Function from Expression", () => {
        const formData = {
            x: {
                y: 1
            },
        }
        const extraData = {
            m: [1, 2, 3],
        }

        const fnExpr1 = "@{{ return formData.x.y }}"
        const fn1 = expressionParser.genFunction(fnExpr1)
        const res1 = fn1(formData, extraData)
        expect(res1).toBe(1)

        const fnExpr2 = "@{{ let res = 4; res = extraData.m.reduce((pre, c) => pre+c,  res); return res; }}"
        const fn2 = expressionParser.genFunction(fnExpr2)
        const res2 = fn2(formData, extraData)
        expect(res2).toBe(10)
    })


});
