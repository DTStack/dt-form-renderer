import ExpressionParser from "../expressionParser";
import { FormItemRuleMapType } from "../../type";

describe('Expression Parser Tests', () => {
    const expressionParser = new ExpressionParser()
    const extraData = {
        x: {
            y: 'ok'
        }
    }

    const ruleMap: FormItemRuleMapType = {
        validators: {
            formJsonValidator: () => Promise.reject("reject formJsonValidator"),
        },
        customRules: {
            noWhiteSpace: (_formData, extraData) => () => Promise.reject(extraData.x.y),
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


    test("Generate Validator Getter", async () => {
        const getter1 = expressionParser.genValidatorGetter(ruleMap, validatorExpr1)
        const v1 = getter1.call(null, {}, extraData)
        await expect(v1()).rejects.toMatch("reject formJsonValidator")

        const getter2 = expressionParser.genValidatorGetter(ruleMap, validatorExpr2)
        const v2 = getter2.call(null, {}, extraData)
        await expect(v2()).rejects.toMatch("ok")

    })

    const docsMap: any = {
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
        const fnExpr1 = " {{ formData.x.y}}"
        const fnExpr2 = "{{ formData.x.y }} "
        const fnExpr3 = "{{  extraData.m }}"

        const flag1 = ExpressionParser.isFunctionExpression(fnExpr1)
        expect(flag1).toBe(true)

        const flag2 = ExpressionParser.isFunctionExpression(fnExpr2)
        expect(flag2).toBe(true)

        const flag3 = ExpressionParser.isFunctionExpression(fnExpr3)
        expect(flag3).toBe(true)
    })

    test("Generate Function from Expression", () => {
        const formData = {
            x: {
                y: 1
            },
        }
        const extraDataRef = {
            current: {
                m: [1, 2, 3],
            }
        }

        const fnExpr1 = "{{ formData.x.y }}"
        const fn1 = expressionParser.generateFunction(fnExpr1)
        const res1 = fn1({  formData, extraDataRef })
        expect(res1).toBe(1)

        const fnExpr2 = "{{ extraData.m.reduce((pre, c) => pre+c,  4) }}"
        const fn2 = expressionParser.generateFunction(fnExpr2)
        const res2 = fn2({ formData, extraDataRef })
        expect(res2).toBe(10)
    })
});
