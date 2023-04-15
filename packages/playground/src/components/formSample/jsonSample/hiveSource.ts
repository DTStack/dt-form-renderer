import type { JsonConfigType } from '@datasync-form-renderer/core';

const hiveSource: JsonConfigType = {
    fieldList: [
        {
            fieldName: 'schema',
            label: 'schema',
            widget: 'Select',
            widgetProps: {
                placeholder: '请选择schema',
                options: '{{ extraData.schemaList }}',
                allowClear: true,
            },
            trigger: 'onChange',
            triggerServices: [
                {
                    serviceName: 'getSchemaList',
                    fieldInExtraData: 'schemaList',
                },
                {
                    serviceName: 'getTableList',
                    fieldInExtraData: 'tableList',
                },
            ],
        },
        {
            fieldName: 'tableName',
            label: '表名',
            dependencies: ['schema'],
            widget: 'Select',
            widgetProps: {
                options: '{{ extraData.tableList }}',
                placeholder: '请选择表名',
            },
            rules: [
                {
                    required: true,
                    message: '请选择表名！',
                },
            ],
            trigger: 'onChange',
            triggerServices: [
                {
                    serviceName: 'getTableList',
                    fieldInExtraData: 'tableList',
                },
                {
                    serviceName: 'getHivePartitions',
                    fieldInExtraData: 'hivePartitions',
                },
            ],
        },
        {
            fieldName: 'partition',
            label: '分区',
            widget: 'AutoComplete',
            dependencies: ['tableName'],
            tooltip:
                '分区支持识别逻辑运算符“>” “=” “<” “and”逻辑运算符，比如比如“pt>= ${xxx} and pt <= ${yyy}”，即代表读取范围在${xxx} ~ ${yyy}的所有分区',
            rules: [
                {
                    validator: '{{ ruleMap.customRules.noWhiteSpace }}',
                },
            ],
            widgetProps: {
                placeholder: '请填写分区信息!',
                options: '{{ extraData.hivePartitions }}',
            },
            trigger: 'onChange',
        },
        {
            fieldName: 'extraConfig',
            tooltip: '{{ docs.extraConfigDoc }}',
            label: '高级配置',
            rules: [
                {
                    validator: '{{ ruleMap.validators.formJsonValidator }}',
                },
            ],
            widgetProps: {
                options: [],
                placeholder: '高级配置需要是json格式',
            },
            widget: 'Input',
            trigger: 'onChange',
        },
    ],
};

export default hiveSource;
