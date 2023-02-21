import { } from "antd/lib/form";

export interface IFormService<FormData = any, ExtraData = any> {
    (formData: FormData, extraData: ExtraData): Promise<any>;
}

export interface FormServicePool<FormData = any, ExtraData = any> {
    [key: string]: IFormService<FormData, ExtraData>;
}

export interface FormItemValidator {
    (rule: any, value: any): Promise<Error | void>
}

export interface IFormItemCustomRule {
    (formData, extraData): FormItemValidator
}

export interface FormItemRuleMap {
    customRules: {
        [key: string]: IFormItemCustomRule
    },
    validators: {
        [key: string]: FormItemValidator
    }
}