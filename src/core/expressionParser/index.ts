import GetExpressionParser from './getExpressionParser';

class JsonConfigTransformer {
    private _jsonArr: any[] = null;
    private _genValueGetter: GetExpressionParser<any, any>['genValueGetter'];
    private _genValidatorGetter;


    constructor(jsonArr, ruleMap) {
        this._jsonArr = jsonArr
        const getExpressionParser = new GetExpressionParser();
        this._genValueGetter = getExpressionParser.genValueGetter.bind(getExpressionParser)
        this._genValidatorGetter = getExpressionParser.genValidatorGetter.bind(getExpressionParser, ruleMap)
    }

    transformRules (rules) {
        return ( formData, extraData ) => {
            return rules.map((rule) => {
                if(GetExpressionParser.containValidatorExpression(rule.validator ?? '')) {
                    return {
                        ...rule,
                        validator: this._genValidatorGetter(rule.validator).call(formData, extraData)
                    }
                }
                return rule
            })
        }
    }

    transform () {
        const jsonArr = this._jsonArr;
        const containGetExpression = GetExpressionParser.containGetExpression
        return jsonArr.map(field => {
            const {
                label,
                destroy,
                hidden,
                rules,
                widgetProps = {},
            } = field
            return {
                ...field,
                label: containGetExpression(label ?? '') 
                    ? this._genValueGetter(label) 
                    : () => label,
                destroy: containGetExpression(destroy ?? '') 
                    ? this._genValueGetter(destroy) 
                    : () => (destroy ?? false),
                hidden: containGetExpression(hidden ?? '') 
                    ? this._genValueGetter(hidden) 
                    : () => (hidden ?? false),
                rules: rules 
                    ? this.transformRules(rules)
                    : () => [],
                widgetProps: {
                    ...widgetProps,
                    options: containGetExpression(widgetProps.options ?? '') 
                        ? this._genValueGetter(widgetProps.options) 
                        : () => widgetProps.options,
                    placeholder: containGetExpression(widgetProps.placeholder ?? '') 
                        ? this._genValueGetter(widgetProps.placeholder) 
                        : () => widgetProps.placeholder,
                    
                }
            }
        })
    }
}


export default JsonConfigTransformer