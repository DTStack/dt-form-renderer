import { languages, IRange } from 'monaco-editor';
type IMonacoLanguageCompletionItem = languages.CompletionItem;

export const fieldCompletionsCreator: (
    range: IRange,
    context: languages.CompletionContext
) => IMonacoLanguageCompletionItem[] = (_range, context) => {
    const range = { ..._range };
    if (context.triggerCharacter === '"') {
        range.startColumn -= 1;
        range.endColumn += 1;
    }
    return [
        {
            label: 'description',
            detail: '表单配置描述',
        },
        {
            label: 'fieldList',
            detail: '表单项配置列表',
        },
        {
            label: 'fieldName',
            detail: '字段名称',
        },
        {
            label: 'widget',
            detail: '组件名称',
        },
        {
            label: 'widgetProps',
            detail: '组件的属性',
            insertText: `"${'widgetProps'}": { $1 },`,
        },
        {
            label: 'dependencies',
            detail: '依赖项',
            insertText: `"${'dependencies'}": [ $1 ],`,
        },
        {
            label: 'initialValue',
            detail: '字段初始值',
        },
        {
            label: 'label',
            detail: 'label 标签的文本',
        },
        {
            label: 'destroy',
            detail: '是否销毁',
        },
        {
            label: 'hidden',
            detail: '是否隐藏',
        },
        {
            label: 'rules',
            detail: '校验规则集',
            insertText: `"${'rules'}": [ $1 ],`,
        },
        {
            label: 'tooltip',
            detail: '配置提示信息',
        },
        {
            label: 'colon',
            detail: '是否在label后展示冒号',
        },
        {
            label: 'extra',
            detail: '展示额外的信息',
        },
        {
            label: 'labelAlign',
            detail: 'label位置',
        },
        {
            label: 'trigger',
            detail: '触发校验和更新的时机',
        },
        {
            label: 'valuePropName',
            detail: '子节点的值的属性',
        },
        {
            label: 'triggerServices',
            detail: 'formService 配置',
        },
        {
            label: 'valueDerived',
            detail: '值的派生',
        },
        {
            label: 'colProps',
            detail: '表单项栅格布局属性',
            insertText: `"${'colProps'}": { "span": 24$1 },`,
        },
    ].map((i) => ({
        ...i,
        range: range,
        sortText: '300',
        kind: languages.CompletionItemKind.Property,
        filterText: i.label.toLowerCase(),
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        insertText: i.insertText ?? `"${i.label}": $1,`,
    }));
};

export const expressionCompletionsCreator: (
    range: IRange
) => IMonacoLanguageCompletionItem[] = (range) =>
    [
        {
            label: '{{ formData.$1 }}',
            detail: '函数表达式 -form',
        },
        {
            label: '{{ extraData. }}',
            detail: '函数表达式 -extraData',
        },
        {
            label: '{{ ruleMap.customRules.$1 }}',
            detail: '自定义校验器 -customRules',
        },
        {
            label: '{{ ruleMap.validators.$1 }}',
            detail: '自定义校验器 -validators',
        },
        {
            label: '{{ docs.$1 }}',
            detail: '自定义 tooltip  -docsMap',
        },
    ].map((i) => ({
        ...i,
        range,
        sortText: '200',
        kind: languages.CompletionItemKind.Variable,
        filterText: i.label.toLowerCase(),
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        insertText: `"${i.label}"`,
    }));
