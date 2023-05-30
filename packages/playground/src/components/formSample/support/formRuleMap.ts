import type {
    FormItemRuleMapType,
    FormItemValidatorType,
    FormItemCustomRuleType,
} from '@dt-form-renderer/core';

const noWhiteSpace: FormItemCustomRuleType = function (formData, extraData) {
    return (rule: any, value: any) => {
        let msg: any;
        if (/\s/.test(value)) {
            msg = '不支持空格！' + formData.schema;
        }
        if (msg) {
            return Promise.reject(new Error(msg));
        } else {
            return Promise.resolve();
        }
    };
};

const formJsonValidator: FormItemValidatorType = function (
    rule: any,
    value: any
) {
    let msg: string;
    try {
        if (value) {
            const t = JSON.parse(value);
            if (typeof t != 'object') {
                msg = '请填写正确的JSON';
            }
        }
    } catch (e) {
        msg = '请检查JSON格式，确认无中英文符号混用！';
    } finally {
        if (msg) {
            return Promise.reject(new Error(msg));
        } else {
            return Promise.resolve();
        }
    }
};

const ruleMap: FormItemRuleMapType = {
    customRules: {
        noWhiteSpace,
    },
    validators: {
        formJsonValidator,
    },
};

export default ruleMap;
