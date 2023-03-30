import React from 'react';
import type { FormItemProps } from 'antd';
import type { TransformedFnType } from './expressionParser/fnExpressionTransformer';

/**
 * @description formRenderer 的 service 类型
 */
export interface FormServiceType<FormData = any, ExtraData = any> {
    (formData: FormData, extraData: ExtraData): Promise<any>;
}

/**
 * @description formRenderer 的 formServicePool 类型
 */
export interface FormServicePoolType<FormData = any, ExtraData = any> {
    [key: string]: FormServiceType<FormData, ExtraData>;
}

/**
 * @description 表单校验器的类型
 */
export type FormItemValidatorType = (
    rule: any,
    value: any,
) => Promise<Error | void>;

/**
 * @description 自定义表单校验器的类型 返回一个 FormItemValidator {@link FormItemValidatorType}
 */
export type FormItemCustomRuleType = (
    formData,
    extraData,
) => FormItemValidatorType;

/**
 * @description formRenderer 的 ruleMap 类型
 */
export interface FormItemRuleMapType {
    customRules: {
        [key: string]: FormItemCustomRuleType;
    };
    validators: {
        [key: string]: FormItemValidatorType;
    };
}

/**
 * @description tooltip 提示文案的类型
 */
export type DocType = React.ReactNode;

/**
 * @description formRenderer 的 docMap 类型
 */
export interface DocsMapType {
    [key: string]: DocType;
}

/**
 * @description 函数表达式配置的类型
 */
export type FunctionExprType = `{{ ${string} }}`;

/**
 * @description 自定义校验器表达式配置的类型
 */
export type ValidatorExprType =
    | `{{ ruleMap.validators.${string} }}`
    | `{{ ruleMap.customRules.${string} }}`;

/**
 * @description 自定义 tooltip 文案表达式配置的类型
 */
export type DocsExprType = `{{ docs.${string} }}`;

/**
 * @description 表单控件的props配置的类型
 */
export interface WidgetPropsConfigType {
    options?: FunctionExprType | any[];
    [key: string]: any;
}

/**
 * @description 触发的 action 配置的类型
 */
export interface TriggerActionType {
    serviceName: string;
    fieldInExtraData: string;
    immediate?: boolean;
}

/**
 * @description 自定义校验器配置的类型
 */
export type ValidatorRuleConfigType = { validator: ValidatorExprType };

/**
 * @description 自定义校验规则配置的类型
 */
export type RuleConfigType = ValidatorRuleConfigType | any;

/**
 * @description json 配置的类型
 */
export interface JsonConfigType {
    fieldName: string;
    widget: string;
    widgetProps?: WidgetPropsConfigType;
    dependencies?: string[];
    initialValue?: any;
    label?: FunctionExprType | string;
    destroy?: FunctionExprType | boolean;
    hidden?: FunctionExprType | boolean;
    rules?: RuleConfigType[];
    tooltip?: DocsExprType | string;
    colon?: FormItemProps['colon'];
    extra?: string;
    labelAlign?: FormItemProps['labelAlign'];
    trigger?: FormItemProps['trigger'];
    valuePropName?: FormItemProps['valuePropName'];
    triggerActions?: TriggerActionType[];
}

/**
 * @description 表单组件的 props 类型，衍生自 WidgetPropsConfigType {@link WidgetPropsConfigType}
 */
export interface WidgetPropsType {
    options: TransformedFnType | any[];
    [key: string]: any;
}

/**
 * @description formRender用于渲染的配置，衍生自 JsonConfigType {@link JsonConfigType}
 */
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
