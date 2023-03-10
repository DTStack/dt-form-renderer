import React from 'react';
import type { FormItemProps } from 'antd';
import type { TransformedFnType } from './expressionParser/fnExpressionTransformer';

export interface FormServiceType<FormData = any, ExtraData = any> {
    (formData: FormData, extraData: ExtraData): Promise<any>;
}

export interface FormServicePoolType<FormData = any, ExtraData = any> {
    [key: string]: FormServiceType<FormData, ExtraData>;
}

export interface FormItemValidatorType {
    (rule: any, value: any): Promise<Error | void>;
}

export interface FormItemCustomRuleType {
    (formData, extraData): FormItemValidatorType;
}

export interface FormItemRuleMapType {
    customRules: {
        [key: string]: FormItemCustomRuleType;
    };
    validators: {
        [key: string]: FormItemValidatorType;
    };
}

export type DocType = React.ReactNode;

export interface DocsMapType {
    [key: string]: DocType;
}

export type FunctionExprType = `{{ ${string} }}`;

export type ValidatorExprType =
    | `{{ ruleMap.validators.${string} }}`
    | `{{ ruleMap.customRules.${string} }}`;

export type DocsExprType = `{{ docs.${string} }}`;

export interface WidgetPropsConfigType {
    options?: FunctionExprType | any[];
    [key: string]: any;
}

export interface TriggerActionType {
    serviceName: string;
    fieldInExtraData: string;
    immediate?: boolean;
}

export type ValidatorRule = { validator: ValidatorExprType };

export type RuleType = ValidatorRule | any;

export interface JsonConfigType {
    fieldName: string;
    widget: string;
    widgetProps?: WidgetPropsConfigType;
    dependencies?: string[];
    initialValue?: any;
    label?: FunctionExprType | string;
    destroy?: FunctionExprType | boolean;
    hidden?: FunctionExprType | boolean;
    rules?: RuleType[];
    tooltip?: DocsExprType | string;
    colon?: FormItemProps['colon'];
    extra?: string;
    labelAlign?: FormItemProps['labelAlign'];
    trigger?: FormItemProps['trigger'];
    valuePropName?: FormItemProps['valuePropName'];
    triggerActions?: TriggerActionType[];
}

export interface WidgetPropsType {
    options: TransformedFnType | any[];
    [key: string]: any;
}

export interface FieldItemMetaType {
    fieldName: string;
    widget: string;
    widgetProps?: WidgetPropsType;
    initialValue?: any;
    label?: TransformedFnType | string;
    destroy?: TransformedFnType | boolean;
    hidden?: TransformedFnType | boolean;
    rules?: TransformedFnType | FormItemProps['rules'];
    tooltip?: React.ReactNode;
    colon?: FormItemProps['colon'];
    labelAlign?: FormItemProps['labelAlign'];
    trigger?: FormItemProps['trigger'];
    valuePropName?: FormItemProps['valuePropName'];
    extra?: string;
}
