const oracleSource = [
    {
        fieldName: "configMode",
        label: "配置方式",
        widget: "RadioGroup",
        rules: [{ required: true, message: "请选择配置方式！" }],
        initialValue: 0,
        widgetProps: {
            options: [
                { label: "选择库表", value: 0 },
                { label: "自定义SQL", value: 1 },
            ],
        },
    },
    {
        fieldName: "schema",
        label: "schema",
        widget: "Select",
        widgetProps: {
            placeholder: "请选择schema",
            options: "{{ extraData.schemaList }}",
            allowClear: true,
        },
        dependencies: ["dependencies"],
        trigger: "onChange",
        triggerActions: [
            {
                serviceName: "getSchemaList",
                fieldInExtraData: "schemaList",
                immediate: true,
            },
            {
                serviceName: "getTableList",
                fieldInExtraData: "tableList",
                immediate: false,
            },
        ],
    },
    {
        fieldName: "tableName",
        label: "表名",
        dependencies: ["schema", "dependencies"],
        widget: "Select",
        widgetProps: {
            options: "{{ extraData.tableList }}",
            placeholder: "请选择表名",
        },
        rules: [
            {
                required: true,
                message: "请选择表名！",
            },
        ],
        trigger: "onChange",
        triggerActions: [
            {
                serviceName: "getTableList",
                fieldInExtraData: "tableList",
                immediate: true,
            },
        ],
    },
    {
        fieldName: "where",
        label: "数据过滤",
        widget: "textArea",
        dependencies: ["schema", "dependencies", "table"],
        widgetProps: {
            placeholder:
                "请参考相关SQL语法填写where过滤语句（不要填写where关键字）。该过滤语句通常用作增量同步",
        },
    },
    {
        fieldName: "splitPK",
        label: "切分键",
        widget: "Input",
        dependencies: ["schema", "dependencies", "table"],
        widgetProps: {
            placeholder:
                "请填写切分键",
        },
    },
    {
        fieldName: "extraConfig",
        label: "高级配置",
        rules: [
            {
                validator: "{{ ruleMap.validators.formJsonValidator }}",
            },
        ],
        widgetProps: {
            options: [],
            placeholder: "高级配置需要是json格式",
        },
        widget: "textArea",
        trigger: "onChange",
    },
];

export default oracleSource;
