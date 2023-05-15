import {
    DocsMapType,
    FormItemRuleMapType,
    FormItemCustomRuleType,
} from '../type';
import FnExpressionTransformer from './fnExpressionTransformer';

/**
 * @description 转化 json config 中的所有表达式
 */
export default class ExpressionParser {
    /** 匹配 ruleMap -- rules */
    static validatorReg =
        /^\s*\{\{\s*(ruleMap\.validators|ruleMap\.customRules)(\.[\w\d_]+)+\s*\}\}\s*$/;

    /** 匹配 docs -- tooltip */
    static docReg = /^\s*\{\{\s*(docs)(\.[\w\d_]+)+\s*\}\}\s*$/;

    /** 匹配函数表达式 -- new function */
    static functionReg = /^\s*\{\{.+?\}\}\s*$/;

    /**
     * @description 判断一个字符串内是否是自定义校验器 validator
     * @param expr 输入字符
     */
    static isValidatorExpression(expr: string) {
        if (!(typeof expr === 'string')) return false;
        return ExpressionParser.validatorReg.test(expr);
    }

    /**
     * @description 判断一个字符串内是否是 docs tooltip
     * @param expr 输入字符
     */
    static isDocsExpression(expr: string) {
        if (!(typeof expr === 'string')) return false;
        return ExpressionParser.docReg.test(expr);
    }

    /**
     * @description 判断一个字符串内是否是函数表达式
     * @param expr 输入字符
     */
    static isFunctionExpression(expr: string) {
        if (!(typeof expr === 'string')) return false;
        return ExpressionParser.functionReg.test(expr);
    }

    /**
     * @description 函数表达式转化器
     */
    private fnExprTransformer = new FnExpressionTransformer();

    /**
     * @description 从表达式中获取validator描述信息
     * @param expr 输入字符
     */
    genValidatorDescFromExpression(expr: string) {
        const result = expr.match(ExpressionParser.validatorReg);
        if (result === null) return null;
        const expression = result[0].replace(/[\s|\{\}]/g, '').split('.');

        return {
            source: expression[0],
            type: expression[1],
            property: expression.slice(2),
        };
    }

    /**
     * @description 生成validator函数
     * @param expr 取值表达式
     * @returns 返回一个函数，函数的返回值就是 validator
     */
    genValidatorGetter(
        validatorMap: FormItemRuleMapType,
        expr: string
    ): FormItemCustomRuleType {
        const validatorDesc = this.genValidatorDescFromExpression(expr);
        if (validatorDesc === null) {
            return () => null;
        }
        if (validatorDesc.type === 'validators') {
            return () => {
                return (
                    validatorDesc.property.reduce(
                        (obj: any, k) => (obj || {})[k],
                        validatorMap?.validators ?? {}
                    ) ?? null
                );
            };
        } else if (validatorDesc.type === 'customRules') {
            return (
                validatorDesc.property.reduce(
                    (obj: any, k) => (obj || {})[k],
                    validatorMap?.customRules ?? {}
                ) ?? null
            );
        } else {
            return () => null;
        }
    }

    /**
     * @description 从取值表达式中获取 tooltip 描述信息
     * @param expr 输入字符
     */
    genDocDescFromExpression(expr: string) {
        const result = expr.match(ExpressionParser.docReg);
        if (result === null) return null;
        const expression = result[0].replace(/[\s|\{\}]/g, '').split('.');

        return {
            source: expression[0],
            property: expression.slice(1),
        };
    }

    /**
     * @description 生成 tooltip
     * @param expr docs 表达式
     * @returns 返回tooltip
     */
    getDoc(docMap: DocsMapType, expr: string) {
        const docDesc = this.genDocDescFromExpression(expr);
        if (docDesc === null) {
            return () => null;
        }
        return (
            docDesc.property.reduce((obj, k) => (obj || {})[k], docMap ?? {}) ??
            null
        );
    }

    /**
     * @description 生成 Function
     * @param expr docs 表达式
     */
    generateFunction(expr: string) {
        const functionBody = expr
            .replace(/^\s*\{\{/, '')
            .replace(/\}\}\s*$/, '');

        return this.fnExprTransformer.transform(functionBody);
    }
}
