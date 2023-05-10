import ExpressionParser from './expressionParser';
import safeInnerHtml from './safeInnerHtml';
import { ScopeType } from './fnExpressionTransformer';
import type {
    RuleConfigType,
    ValidatorRuleConfigType,
    JsonConfigFieldType,
    DocsMapType,
    FormItemRuleMapType,
    FormItemCustomRuleType,
    TriggerServiceType,
    ServiceTriggerKind,
} from '../type';
import React from 'react';

class JsonConfigTransformer {
    private _jsonArr: JsonConfigFieldType[] = null;
    private _genValidatorGetter: (expr: string) => FormItemCustomRuleType;
    private _getDoc: (expr: string) => React.ReactNode;
    private _genFunction: ExpressionParser['generateFunction'];

    constructor(
        jsonArr: JsonConfigFieldType[],
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

    transformFnExprField(value: string) {
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

    transformValueDerived(valueDerived: string) {
        const isFunctionExpression = ExpressionParser.isFunctionExpression;
        const res = isFunctionExpression(valueDerived)
            ? this._genFunction(valueDerived)
            : valueDerived
            ? () => valueDerived
            : null;
        return res;
    }

    transformWidgetsProps = (widgetProps: {}) => {
        const transformedWidgetProps: {} = {};
        if (!widgetProps) return transformedWidgetProps;
        Object.entries(widgetProps).map(([key, value]) => {
            transformedWidgetProps[key] = this.transformFnExprField(
                value as string,
            );
        });
        return transformedWidgetProps;
    };

    getServicesTriggers(triggerServices: TriggerServiceType[]) {
        if (!triggerServices?.length) return [];
        const set = new Set<ServiceTriggerKind>();
        triggerServices.forEach(({ triggers }) => {
            if (!triggers?.length) return [];
            triggers.forEach((trigger) => set.add(trigger));
        });
        return Array.from(set);
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
                valueDerived,
                triggerServices,
            } = field;
            return {
                ...field,
                label: this.transformFnExprField(label),
                destroy: this.transformFnExprField(destroy as string),
                hidden: this.transformFnExprField(hidden as string),
                valueDerived: this.transformValueDerived(valueDerived),
                rules: rules ? this.transformRules(rules) : () => [],
                tooltip: this.transformTooltip(tooltip),
                servicesTriggers: this.getServicesTriggers(triggerServices),
                widgetProps: this.transformWidgetsProps(widgetProps),
            };
        });
    }
}

export default JsonConfigTransformer;
