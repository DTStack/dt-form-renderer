import type { JsonConfigType } from '@dt-form-renderer/core';

const hiveSource: JsonConfigType = {
    fieldList: [
        {
            fieldName: 'loginType',
            label: '登录方式',
            widget: 'RadioGroup',
            widgetProps: {
                options:
                    '{{ [ {value: 1, label: "账号密码"}, {value: 2, label: "短信验证码"} ] }}',
            },
            initialValue: 1,
        },
        {
            fieldName: 'userName',
            label: '账号',
            dependencies: ['loginType'],
            destroy: '{{ formData.loginType !== 1 }}',
            widget: 'input',
            widgetProps: {
                placeholder: '请输入账号',
            },
            rules: [
                {
                    required: true,
                    message: '请输入账号！',
                },
            ],
        },
        {
            fieldName: 'password',
            label: '密码',
            dependencies: ['loginType'],
            destroy: '{{ formData.loginType !== 1 }}',
            widget: 'password',
            widgetProps: {
                placeholder: '请输入密码',
            },
            rules: [
                {
                    required: true,
                    message: '请输入密码！',
                },
            ],
        },
        {
            fieldName: 'telNum',
            label: '手机号',
            dependencies: ['loginType'],
            destroy: '{{ formData.loginType !== 2 }}',
            widget: 'input',
            widgetProps: {
                placeholder: '请输入手机号',
            },
            rules: [
                {
                    required: true,
                    message: '请输入手机号！',
                },
            ],
        },
        {
            fieldName: 'authCode',
            label: '验证码',
            dependencies: ['loginType'],
            destroy: '{{ formData.loginType !== 2 }}',
            widget: 'input',
            widgetProps: {
                placeholder: '请输入验证码',
            },
            rules: [
                {
                    required: true,
                    message: '请输入验证码！',
                },
            ],
        },
    ],
};

export default hiveSource;
