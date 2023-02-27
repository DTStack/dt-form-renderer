import ExpressionParser from './expressionParser';
import safeInnerHtml from './safeInnerHtml';

class JsonConfigTransformer {
    private _jsonArr: any[] = null;
    private _genValidatorGetter;
    private _getDoc;
    private _genFunction;


    constructor(jsonArr, ruleMap, docsMap) {
        this._jsonArr = jsonArr
        const expressionParser = new ExpressionParser();
        this._genValidatorGetter = expressionParser.genValidatorGetter.bind(expressionParser, ruleMap)
        this._getDoc = expressionParser.getDoc.bind(expressionParser, docsMap)
        this._genFunction = expressionParser.generateFunction.bind(expressionParser)
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
        const isFunctionExpression = ExpressionParser.isFunctionExpression
        const res = isFunctionExpression(value)
            ? this._genFunction(value)
            : value
        return res
    }

    transformTooltip (tooltip: string) {
        const isDocsExpression = ExpressionParser.isDocsExpression;
        if(isDocsExpression(tooltip)) {
            return this._getDoc(tooltip);
        }
        if(typeof tooltip === 'string') {
            return safeInnerHtml(tooltip)
        }
        return null
    }

    transform () {
        const jsonArr = this._jsonArr;
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
                tooltip: this.transformTooltip(tooltip),
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