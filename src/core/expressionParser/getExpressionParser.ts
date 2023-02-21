export default class GetExpressionParser<IFormData, IExtraData> {
    static reg = /\{\{\s*(formData|extraData)(\.[\w\d_]+)+\s*(\}\})/g;
    static validatorReg = /\{\{\s*(ruleMap\.validators|ruleMap\.customRules)(\.[\w\d_]+)+\s*(\}\})/g;

    /**
     * @description 判断一个字符串内是否包含取值表达式
     * @param expr 输入字符
     */
    static containGetExpression(expr: string) {
        if(!(typeof expr === 'string')) return false
        return !!expr.match(GetExpressionParser.reg)?.length
    }

    /**
     * @description 判断一个字符串内是否包含自定义校验器 validator
     * @param expr 输入字符
     */
    static containValidatorExpression(expr: string) {
        if(!(typeof expr === 'string')) return false
        return !!expr.match(GetExpressionParser.validatorReg)?.length
    }

    /**
     * @description 从取值表达式中获取数据描述信息
     * @param expr 输入字符
     */
    genValueDescFromExpression (expr: string) {
        const result = expr.match(GetExpressionParser.reg);
        if(result === null) return null
        const expression = result[0]
            .replace(/[\s|\{\}]/g, '')
            .split('.');

        return {
            source: expression[0],
            property: expression.slice(1)
        }
    }


    /**
     * @description 生成求值函数
     * @param expr 取值表达式
     * @returns 返回一个函数，函数的返回值就是表达式的值
     */
    genValueGetter (expr: string) {
        const valueDesc = this.genValueDescFromExpression(expr)
        if(valueDesc === null) {
            return () => null
        }
        return (formData: IFormData, extraData: IExtraData) => {
            if (valueDesc.source === "formData") {
                return valueDesc.property
                    .reduce(
                        (obj: any, k) => (obj || {})[k],
                        (formData ?? {})
                    ) ?? null
            } else if (valueDesc.source === "extraData") {
                return valueDesc.property
                    .reduce(
                        (obj: any, k) => (obj || {})[k],
                        (extraData ?? {})
                    ) ?? null
            } else {
                return (_formData?: IFormData, _extraData?: IExtraData) => null
            }
        }
    }


    /**
     * @description 从表达式中获取validator描述信息
     * @param expr 输入字符
     */
    genValidatorDescFromExpression (expr: string) {
        const result = expr.match(GetExpressionParser.validatorReg);
        if(result === null) return null
        const expression = result[0]
            .replace(/[\s|\{\}]/g, '')
            .split('.');

        return {
            source: expression[0],
            type: expression[1],
            property: expression.slice(2),
        }
    }

    /**
     * @description 生成validator函数
     * @param expr 取值表达式
     * @returns 返回一个函数，函数的返回值就是 validator
     */
    genValidatorGetter (validatorMap: any, expr: string) {
        const validatorDesc = this.genValidatorDescFromExpression(expr);
        if (validatorDesc === null) {
            return () => null
        }
        if(validatorDesc.type === 'validators') {
            return () => {
                return validatorDesc.property
                    .reduce(
                        (obj: any, k) => (obj || {})[k],
                        (validatorMap?.validators ?? {})
                    ) ?? null
            }
        } else if (validatorDesc.type === 'customRules') {
            return validatorDesc.property
                .reduce (
                    (obj: any, k) => (obj || {})[k],
                    (validatorMap?.customRules ?? {})
                ) ?? null
        } else {
            return () => null
        }
    }
}
