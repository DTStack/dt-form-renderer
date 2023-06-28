<h1 align='center'>表单的JSON配置</h1>

JsonConfig 用于描述表单的渲染，它的一级结构如下所示
```json
{
  "description": "Some description about this json config.",
  "fieldList": [],
}
```

## description

`description` 字段与表单渲染无关，它仅用于描述当前这份 jsonConfig，在某些情况下它非常有意义。表单的 jsonConfig 可能存在在服务器上，在需要渲染表单时通过接口获取，此时，`description` 字段可以帮助我们快速了解接口返回的 jsonConfig。另外，`description` 字段对应的值可以是任意符合 JSON 格式的值，比如：
```json
{
  "description": {
    "author": "xxx",
  },
  "fieldList": [],
}
```

<br/>

## fieldList
`fieldList` 字段的值是一个数组，数组的每一项代表一个表单项，表单项配置在数组中出现的顺序就是表单项的渲染顺序，表单项的具体字段配置如下：
+ `fieldName` 表单项的字段名
+ `widget` 表单项组件，例如 `Select`、`Input` 等
+ `widgetProps` 表单项组件的 props
+ `dependencies` 表单项的值依赖哪些字段，当被依赖的字段的值发生改变时，当前字段的值会被重置为 `initialValue`
+ `initialValue` 表单项的初始值
+ `label` 表单项的 label，**支持使用函数表达式**
+ `destroy` 表单项是否被销毁，表单项被销毁后，不再渲染此表单项，并且不再保留表单项的值，**支持使用函数表达式**
+ `hidden` 表单项是否被隐藏，表单项项被隐藏后，不再渲染此表单项，但仍保留此表单项的值，**支持使用函数表达式**
+ `rules` 表单项的校验规则，内部支持使用 **自定义校验表达式**
+ `tooltip` 表单项的 tooltip， **支持使用自定义tooltip表达式**
+ `triggerServices` FormService 配置
+ `valueDerived` **支持函数表达式**，指定当前表单项的值如何从`formData`和`extraData`中衍生出来，通常与 `hidden` 和 `widgetProps.disabled` 配合使用
+ `valuePropName` 同 ant-design FormItem 的 trigger
+ `trigger` 同 ant-design FormItem 的 trigger
+ `labelAlign` 同 ant-design FormItem 的 labelAlign
+ `colon` 同 ant-design FormItem 的 colon
+ `extra` 同 ant-design FormItem 的 extra




