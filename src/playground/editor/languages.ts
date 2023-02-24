import { languages, IRange } from 'monaco-editor';
type IMonacoLanguageCompletionItem = languages.CompletionItem

export const fieldCompletionsCreator: (range: IRange) => IMonacoLanguageCompletionItem[] = (range) => [
    {
        label: "fieldName",
        detail: "字段名称",
    },
    {
        label: "widget",
        detail: "组件名称",
    },
    {
        label: "dependencies",
        detail: "依赖项",
        insertText: `"${"dependencies"}": [ $1 ],`
    },
    {
        label: "initialValue",
        detail: "字段初始值",
    },
    {
        label: "colon",
        detail: "是否在label后展示冒号",
    },
    {
        label: "extra",
        detail: "展示额外的信息",
    },
    {
        label: "labelAlign",
        detail: "label位置",
    },
    {
        label: "trigger",
        detail: "触发校验和更新的时机",
    },
    {
        label: "valuePropName",
        detail: "子节点的值的属性",
    },
    {
        label: "destroy",
        detail: "是否销毁",
    },
    {
        label: "hidden",
        detail: "是否隐藏",
    },
    {
        label: "label",
        detail: "label 标签的文本",
    },
    {
        label: "rules",
        detail: "校验规则集",
        insertText: `"${"rules"}": [ $1 ],`
    },
    {
        label: "tooltip",
        detail: "配置提示信息",
    },
    {
        label: "widgetProps",
        detail: "组件的属性",
        insertText: `"${"widgetProps"}": { $1 },`
    },
    {
        label: "triggerActions",
        detail: "触发的action配置",
    },
].map(i => ({
    ...i,
    range: range,
    sortText: "300",
    kind: languages.CompletionItemKind.Property,
    filterText: i.label.toLowerCase(),
    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
    insertText: i.insertText ??`"${i.label}": $1,`,
}))


export const expressionCompletionsCreator: (range: IRange) => IMonacoLanguageCompletionItem[] = (range) => [
    {
        label: "{{ formData.$1 }}",
        detail: "取值表达式 -form",
    },
    {
        label: "{{ extraData. }}",
        detail: "取值表达式 -extraData",
    },
    {
        label: "{{ ruleMap.customRules.$1 }}",
        detail: "自定义校验器 -customRules",
    },
    {
        label: "{{ ruleMap.validators.$1 }}",
        detail: "自定义校验器 -validators",
    },
    {
        label: "@{{ return $1 }}",
        detail: "函数表达式",
    },
].map(i => ({
    ...i,
    range,
    sortText: "200",
    kind: languages.CompletionItemKind.Variable,
    filterText: i.label.toLowerCase(),
    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
    insertText: `"${i.label}"`,
}))