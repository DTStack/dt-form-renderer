import ExpressionParser from './expressionParser';

class JsonConfigTransformer {
    private _jsonArr: any[] = null;
    private _genValueGetter;
    private _genValidatorGetter;
    private _getDoc;
    private _genFunction;


    constructor(jsonArr, ruleMap, docsMap) {
        this._jsonArr = jsonArr
        const expressionParser = new ExpressionParser();
        this._genValueGetter = expressionParser.genValueGetter.bind(expressionParser)
        this._genValidatorGetter = expressionParser.genValidatorGetter.bind(expressionParser, ruleMap)
        this._getDoc = expressionParser.getDoc.bind(expressionParser, docsMap)
        this._genFunction = expressionParser.genFunction.bind(expressionParser)
    }

    transformRules (rules) {
        return ( formData, extraData ) => {
            return rules.map((rule) => {
                if(ExpressionParser.isValidatorExpression(rule.validator ?? '')) {
                    return {
                        ...rule,
                        validator: this._genValidatorGetter(rule.validator).call(formData, extraData)
                    }
                }
                return rule
            })
        }
    }

    transformField(value) {
        const isGetExpression = ExpressionParser.isGetExpression
        const isFunctionExpression = ExpressionParser.isFunctionExpression
        const res = isFunctionExpression(value)
            ? this._genFunction(value)
            : isGetExpression(value)
                ? this._genValueGetter(value)
                : value
        return res
    }

    transform () {
        const jsonArr = this._jsonArr;
        const isDocsExpression = ExpressionParser.isDocsExpression;
        return jsonArr.map(field => {
            const {
                label,
                destroy,
                hidden,
                rules,
                tooltip,
                widgetProps = {},
            } = field
            return {
                ...field,
                label: this.transformField(label),
                destroy: this.transformField(destroy),
                hidden: this.transformField(hidden),
                rules: rules 
                    ? this.transformRules(rules)
                    : () => [],
                tooltip: isDocsExpression(tooltip)
                    ? this._getDoc(tooltip)
                    : tooltip,
                widgetProps: {
                    ...widgetProps,
                    options: this.transformField(widgetProps.options),
                    placeholder: this.transformField(widgetProps.placeholder)
                }
            }
        })
    }
}


export default JsonConfigTransformer