import ExpressionParser from './expressionParser';
import safeInnerHtml from './safeInnerHtml';
import { ScopeType } from './fnExpressionTransformer';
import type { RuleType, ValidatorRule, JsonConfigType, DocsMapType, FormItemRuleMapType } from '../type'; 

class JsonConfigTransformer {
    private _jsonArr: JsonConfigType[] = null;
    private _genValidatorGetter;
    private _getDoc;
    private _genFunction: ExpressionParser['generateFunction'];


    constructor(jsonArr: JsonConfigType[], ruleMap: FormItemRuleMapType, docsMap: DocsMapType) {
        this._jsonArr = jsonArr
        const expressionParser = new ExpressionParser();
        this._genValidatorGetter = expressionParser.genValidatorGetter.bind(expressionParser, ruleMap)
        this._getDoc = expressionParser.getDoc.bind(expressionParser, docsMap)
        this._genFunction = expressionParser.generateFunction.bind(expressionParser)
    }

    transformRules (rules: RuleType[]) {
        return (scope: ScopeType) => {
            return rules.map((rule) => {
                if(ExpressionParser.isValidatorExpression((rule as ValidatorRule).validator ?? '')) {
                    return {
                        ...rule,
                        validator: this._genValidatorGetter((rule as ValidatorRule).validator).call(null, scope.formData, scope.extraDataRef.current)
                    }
                }
                return rule
            })
        }
    }

    transformField(value: string) {
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
                destroy: this.transformField(destroy as string),
                hidden: this.transformField(hidden as string),
                rules: rules 
                    ? this.transformRules(rules)
                    : () => [],
                tooltip: this.transformTooltip(tooltip),
                widgetProps: {
                    ...widgetProps,
                    options: this.transformField(widgetProps.options as string),
                    placeholder: this.transformField(widgetProps.placeholder)
                }
            }
        })
    }
}


export default JsonConfigTransformer