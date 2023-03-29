import ExpressionParser from './expressionParser';
import safeInnerHtml from './safeInnerHtml';
import { ScopeType } from './fnExpressionTransformer';
import type {
    RuleConfigType,
    ValidatorRuleConfigType,
    JsonConfigType,
    DocsMapType,
    FormItemRuleMapType,
    FormItemCustomRuleType,
} from '../type';
import React from 'react';

class JsonConfigTransformer {
    private _jsonArr: JsonConfigType[] = null;
    private _genValidatorGetter: (expr: string) => FormItemCustomRuleType;
    private _getDoc: (expr: string) => React.ReactNode;
    private _genFunction: ExpressionParser['generateFunction'];

    constructor(
        jsonArr: JsonConfigType[],
        ruleMap: FormItemRuleMapType,
        docsMap: DocsMapType,
    ) {
        this._jsonArr = jsonArr;
        const expressionParser = new ExpressionParser();
        this._genValidatorGetter = expressionParser.genValidatorGetter.bind(
            expressionParser,
            ruleMap,
        );
        this._getDoc = expressionParser.getDoc.bind(expressionParser, docsMap);
        this._genFunction =
            expressionParser.generateFunction.bind(expressionParser);
    }

    transformRules(rules: RuleConfigType[]) {
        return (scope: ScopeType) => {
            return rules.map((rule: ValidatorRuleConfigType) => {
                if (
                    !ExpressionParser.isValidatorExpression(
                        rule.validator ?? '',
                    )
                ) {
                    return rule;
                }
                const validator = this._genValidatorGetter(rule.validator).call(
                    null,
                    scope.formData,
                    scope.extraDataRef.current,
                );
                return validator
                    ? {
                          ...rule,
                          validator,
                      }
                    : rule;
            });
        };
    }

    transformField(value: string) {
        const isFunctionExpression = ExpressionParser.isFunctionExpression;
        const res = isFunctionExpression(value)
            ? this._genFunction(value)
            : value;
        return res;
    }

    transformTooltip(tooltip: string) {
        const isDocsExpression = ExpressionParser.isDocsExpression;
        if (isDocsExpression(tooltip)) {
            return this._getDoc(tooltip);
        }
        if (typeof tooltip === 'string') {
            return safeInnerHtml(tooltip);
        }
        return null;
    }

    transform() {
        const jsonArr = this._jsonArr;
        return jsonArr.map((field) => {
            const {
                label,
                destroy,
                hidden,
                rules,
                tooltip,
                widgetProps = {},
            } = field;
            return {
                ...field,
                label: this.transformField(label),
                destroy: this.transformField(destroy as string),
                hidden: this.transformField(hidden as string),
                rules: rules ? this.transformRules(rules) : () => [],
                tooltip: this.transformTooltip(tooltip),
                widgetProps: {
                    ...widgetProps,
                    options: this.transformField(widgetProps.options as string),
                    placeholder: this.transformField(widgetProps.placeholder),
                },
            };
        });
    }
}

export default JsonConfigTransformer;
