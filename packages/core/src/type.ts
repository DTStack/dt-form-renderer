import React from 'react';
import type { FormItemProps } from 'antd';
import type { TransformedFnType } from './expressionParser/fnExpressionTransformer';

/**
 * @description service 的触发方式枚举
 */
export enum ServiceTriggerEnum {
    onMount = 'onMount',
    onChange = 'onChange',
    onBlur = 'onBlur',
    onFocus = 'onFocus',
    onSearch = 'onSearch',
}

/**
 * @description 枚举类型转化为联合类型
 */
type EnumToUnion<Enum extends string | number> =
    `${Enum}` extends `${infer Num extends number}` ? Num : `${Enum}`;

/**
 * @description service 的触发方式的联合类型
 */
export type ServiceTriggerKind = EnumToUnion<ServiceTriggerEnum>;

/**
 * @description service 参数类型
 */
export interface IServiceContext {
    /** 触发service的字段 */
    fieldName: string;
    /** service 被触发时表单的数据 */
    formData: any;
    /** service 被触发时extra的值 */
    extraData: any;
    /** 触发service时的参数，比如 onSearch 回调函数的参数 */
    args: any[];
    /** service 触发方式 */
    trigger: ServiceTriggerKind;
}

/**
 * @description formRenderer 的 service 类型
 */
export interface FormServiceType<Result = any> {
    (context: IServiceContext): Promise<Result>;
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
    value: any
) => Promise<Error | void>;

/**
 * @description 自定义表单校验器的类型 返回一个 FormItemValidator {@link FormItemValidatorType}
 */
export type FormItemCustomRuleType = (
    formData,
    extraData
) => FormItemValidatorType;

/**
 * @description formRenderer 的 ruleMap 类型
 */
export interface FormItemRuleMapType {
    customRules?: {
        [key: string]: FormItemCustomRuleType;
    };
    validators?: {
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
    triggers?: ServiceTriggerKind[];
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
    triggerServices?: TriggerServiceType[];
    valueDerived?: FunctionExprType;
    required?: FunctionExprType | boolean;
    noStyle?: boolean;
}

/**
 * @description json 配置的类型
 */
export interface JsonConfigType {
    fieldList: JsonConfigFieldType[];
    description?: any;
}

/**
 * @description 表单组件的 props 类型，衍生自 WidgetPropsConfigType {@link WidgetPropsConfigType}
 */
export interface WidgetPropsType {
    [key: string]: TransformedFnType | unknown;
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
    required?: TransformedFnType | boolean;
    rules?: TransformedFnType | FormItemProps['rules'];
    tooltip?: React.ReactNode;
    colon?: FormItemProps['colon'];
    labelAlign?: FormItemProps['labelAlign'];
    trigger?: FormItemProps['trigger'];
    valuePropName?: FormItemProps['valuePropName'];
    extra?: string;
    valueDerived?: TransformedFnType;
    servicesTriggers?: ServiceTriggerKind[];
    span?: number;
    noStyle?: boolean;
}
