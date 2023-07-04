import type { JsonConfigType } from '@dt-form-renderer/core';
const oracleSource: JsonConfigType = {
    fieldList: [
        {
            fieldName: 'sourceType',
            label: '数据源类型',
            widget: 'Select',
            widgetProps: {
                placeholder: '请选择数据源类型',
                options: [
                    { label: 'MySQL', value: 'mysql' },
                    { label: 'Hive', value: 'hive' },
                ],
                allowClear: true,
            },
            rules: [{ required: true, message: '请选择数据源类型！' }],
            triggerServices: [
                {
                    serviceName: 'getSourceList',
                    fieldInExtraData: 'sourceList',
                    triggers: ['onChange'],
                },
            ],
        },
        {
            fieldName: 'sourceId',
            label: '数据源',
            dependencies: ['sourceType'],
            widget: 'Select',
            widgetProps: {
                placeholder: '请选择数据源',
                options: '{{ extraData.sourceList }}',
                allowClear: true,
            },
            rules: [{ required: true, message: '请选择数据源！' }],
            triggerServices: [
                {
                    serviceName: 'getSourceList',
                    fieldInExtraData: 'sourceList',
                    triggers: ['onMount'],
                },
                {
                    serviceName: 'getSchemaList',
                    fieldInExtraData: 'schemaList',
                    triggers: ['onChange'],
                },
            ],
        },
        {
            fieldName: 'configMode',
            label: '配置方式',
            widget: 'RadioGroup',
            rules: [{ required: true, message: '请选择配置方式！' }],
            initialValue: 0,
            widgetProps: {
                options: [
                    { label: '选择库表', value: 0 },
                    { label: '自定义SQL', value: 1 },
                ],
            },
        },
        {
            fieldName: 'schema',
            label: 'schema',
            widget: 'Select',
            widgetProps: {
                placeholder: '请选择schema',
                options: '{{ extraData.schemaList }}',
                allowClear: true,
            },
            destroy: '{{ formData.configMode === 1 }}',
            dependencies: ['sourceId', 'configMode'],
            triggerServices: [
                {
                    serviceName: 'getSchemaList',
                    fieldInExtraData: 'schemaList',
                    triggers: ['onMount'],
                },
                {
                    serviceName: 'getTableList',
                    fieldInExtraData: 'tableList',
                    triggers: ['onChange'],
                },
            ],
        },
        {
            fieldName: 'tableName',
            label: '表名',
            dependencies: ['schema'],
            destroy: '{{ formData.configMode === 1 }}',
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
            triggerServices: [
                {
                    serviceName: 'getTableList',
                    fieldInExtraData: 'tableList',
                    triggers: ['onMount'],
                },
            ],
        },
        {
            fieldName: 'customSql',
            label: 'SQL',
            dependencies: ['sourceId', 'configMode'],
            widget: 'sqlEditor',
            widgetProps: {
                style: {
                    height: 100,
                },
            },
            destroy: '{{ formData.configMode !== 1 }}',
            rules: [{ required: true, message: '请输入自定义SQL' }],
            initialValue: '-- 仅限查询语句，例如select a,b from ...\n',
        },
        {
            fieldName: 'where',
            label: '数据过滤',
            widget: 'textArea',
            destroy: '{{ formData.configMode === 1 }}',
            dependencies: ['table', 'customSql'],
            widgetProps: {
                placeholder:
                    '请参考相关SQL语法填写where过滤语句（不要填写where关键字）。该过滤语句通常用作增量同步',
            },
        },
        {
            fieldName: 'splitPK',
            label: '切分键',
            tooltip: '仅支持数值型字段',
            widget: 'Input',
            dependencies: ['table', 'customSql'],
            rules: [{ validator: '{{ ruleMap.customRules.noWhiteSpace }}' }],
            widgetProps: {
                placeholder: '请填写切分键',
            },
        },
        {
            fieldName: 'extraConfig',
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
            widget: 'textArea',
        },
    ],
};

export default oracleSource;
