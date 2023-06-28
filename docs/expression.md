<h1 align='center'> 在表单的JSON配置中使用表达式 </h1>
dt-form-renderer 支持三种表达式

+ 函数表达式
+ 自定义校验器表达式
+ 自定义doc/tooltip表达式

<br/>

## 函数表达式
函数表达式用于表达/实现联动逻辑，它与 vue 的插值表达式的形式类似，使用双花括号包裹 `{{...}}`
```json
{  
  "hidden": "{{ formData.type === 1 }}",
}
```
在函数表达式内部，内置 `formData` 和 `extraData` 两个变量，其中 `formData` 是当前表单收集到的数据，`extraData` 是外部数据。`extraData`  的数据来源于 `Service`  或者 `FormRenderer` 组件的 props。函数表达式可以在绝大多数的字段配置项中使用。

<br/>

## 自定义校验器表达式
自定义校验器表达式实际上是函数表达式的一种，它用于指定表单项的自定义校验器。自定义校验器分为两种类型：

类型一：普通的校验器，与 [ant-design#FORM#FormItem#Rule#validator](https://ant.design/components/form-cn#rule) 一样
```typescript
type FormItemValidatorType = (rule: any, value: any) => Promise<Error | void>;
```

类型二：一个函数，接收 `formData` 和 `extraData` 为参数，返回普通的函数校验器
```typescript
type FormItemCustomRuleType = (formData: any, extraData: any) => FormItemValidatorType;
```

在代码中声明表单校验器后，通过 `FormRenderer` 组件的 props 传入
```jsx
import FormRenderer from 'dt-form-renderer';

const ruleMap = {
  validators: {
    validator1: (rule,value) => { }
  },
  customRules: {
    rule1: ( formData, extraData ) => (rule,value) => { }
  }
}

function FormDemo () {
  return (
    <FormRenderer
      ruleMap={ruleMap}
      // ...
    />
  )
}
```

<br/>

在表单项的 JSON 配置中使用
```json
{
  "rules": [
    { "required": true, "message": "请输入xxx！"},
    { "validator": "{{ ruleMap.validators.validator1 }}" },
    { "validator": "{{ ruleMap.customRules.rule1 }}" },
  ],
}
```

## 自定义doc/tooltip表达式
自定义校验器表达式实际上也是函数表达式的一种，它用于指定表单项比较复杂的 tooltip 提示。与自定义表单校验器相同，首先需要在代码中声明自定义的 tooltip 内容，然后通过 `FormRenderer` 组件的 props 传入
```jsx
import FormRenderer from 'dt-form-renderer';

const docsMap = {
    doc1: (<div>some content</doiv),
};

function FormDemo () {
  return (
    <FormRenderer
      docsMap={docsMap}
      // ...
    />
  )
}
```

在表单项的 JSON 配置中使用
```json
{
   "tooltip": "{{ docs.extraConfigDoc }}",
}
```


