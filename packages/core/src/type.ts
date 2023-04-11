import React from 'react';
import type { FormItemProps } from 'antd';
import type { TransformedFnType } from './expressionParser/fnExpressionTransformer';

/**
 * @description service 的触发类型
 */
export enum ServiceTriggerEnum {
    onMount = 'onMount',
    onChange = 'onChange',
    onBlur = 'onBlur',
    onFocus = 'onFocus',
    onSearch = 'onSearch',
}

/**
 * @description service 参数类型
 */
export interface IServiceContext {
    formData: any;
    extraData: any;
    args: any[];
    trigger: ServiceTriggerEnum;
}

/**
 * @description formRenderer 的 service 类型
 */
export interface FormServiceType {
    (context: IServiceContext): Promise<any>;
}

/**
 * @description formRenderer 的 formServicePool 类型
 */
export interface FormServicePoolType {
    [key: string]: FormServiceType;
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
 * @description 触发 service 配置的类型
 */
export interface TriggerServiceType {
    serviceName: string;
    fieldInExtraData: string;
    triggers?: ServiceTriggerEnum[];
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
 * @description json 配置中字段配置的类型
 */
export interface JsonConfigFieldType {
    fieldName: string;
    widget: string;
    widgetProps?: WidgetPropsConfigType;
    dependencies?: string[];
    initialValue?: any;
    label: FunctionExprType | string;
    destroy?: FunctionExprType | boolean;
    hidden?: FunctionExprType | boolean;
    rules?: RuleConfigType[];
    tooltip?: DocsExprType | string;
    colon?: FormItemProps['colon'];
    extra?: string;
    labelAlign?: FormItemProps['labelAlign'];
    trigger?: FormItemProps['trigger'];
    valuePropName?: FormItemProps['valuePropName'];
    triggerServices?: TriggerServiceType[];
    valueDerived?: FunctionExprType;
}

/**
 * @description json 配置的类型
 */
export interface JsonConfigType {
    fieldList: JsonConfigFieldType[];
}

/**
 * @description 表单组件的 props 类型，衍生自 WidgetPropsConfigType {@link WidgetPropsConfigType}
 */
export interface WidgetPropsType {
    options: TransformedFnType | any[];
    [key: string]: any;
}

/**
 * @description formRender用于渲染的配置，衍生自 JsonConfigFieldItemType {@link JsonConfigFieldType}
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
    valueDerived?: TransformedFnType;
    servicesTriggers?: ServiceTriggerEnum[];
}
