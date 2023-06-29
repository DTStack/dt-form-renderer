<h1 align='center'>FormService 和 ExtraData</h1>

## FormService 是什么

对于某些表单项来说，它的渲染可能需要一些外部数据的支持，例如 Select 下拉框的的选项数据来源于后端接口。此时就需要描述这份数据的获取逻辑，**FormService** 就是用来解决这个问题的。

## 如何声明 FormService

FormService 的基本格式如下所示

```js
function service1(formData, extraData, trigger, args) {
    return new Promise((resolve) => {
        resolve(data);
    });
}
```

FormService 接收四个参数

-   `formData` 当前的表单收集到的数据
-   `extraData` 当前 FormRenderer 的 extraData 数据，下文中会详细解释 extraData 的作用以及数据来源
-   `trigger` FormService 的触发时机，下文中会详细解释 trigger
-   `args` 触发 FormService 的事件对应的回调函数的参数，下文中会解释 args 的数据来源
    并返回一个 Promise

然后将 FormService 注入到 FormRenderer 中

```jsx
import FormRenderer from 'dt-form-renderer';
import { service1, service2 } from './formService';

const formServicePool = {
    service1,
    service2,
};

function FormDemo() {
    return <FormRenderer formServicePool={formServicePool} />;
}
```

## 如何在 JsonConfig 中配置

在 JsonConfig 中描述 FormService 有三个关键点

-   调用哪一个 FormService，即 FormService 的名称？
-   FormService 的触发时机是什么？
-   FormService 返回的数据如何存储？

对应配置如下所示

```json
{
    "triggerServices": [
        {
            "serviceName": "service1",
            "fieldInExtraData": "selectOptionData",
            "trigger": ["onMount", "onChange", "onBlur", "onFocus", "onSearch"]
        }
    ]
}
```

### ExtraData

FormRenderer 内部维护了一个存储外部数据的容器-`extraData` ，`extraData`的数据来源有两个

1. 通过 FormRenderer 的 `defaultExtraData` prop 传入
2. 通过配置 `fieldInExtraData` 指定 FormService 返回的数据存储在 `extraData` 中

对应的，可以在 JsonConfig 中可以使用函数表达式来取出并应用 `extraData` 内部的数据，例如

```json
{
    "fieldName": "tableName",
    "label": "表名",
    "widget": "Select",
    "widgetProps": {
        "options": "{{ extraData.tableList }}",
        "placeholder": "请选择表名"
    },
    "triggerServices": [
        {
            "serviceName": "getTableList",
            "fieldInExtraData": "tableList",
            "trigger": "onMount"
        }
    ]
}
```

另外 extraData 内置了一个 `serviceLoading` 属性，用于存储 FormService 的 loading 状态，可以使用 `extraData.serviceLoading.serviceName` 的方式获取 FormService 对应的 loading 状态

```json
{
    "widget": "Select",
    "widgetProps": {
        "loading": "{{ extraData.serviceLoading.getTableList }}"
    },
    "triggerServices": [
        {
            "serviceName": "getTableList"
        }
    ]
}
```

### Trigger

`trigger` 即为 FormService 的触发时机，共有 5 种

-   `onMount` 当前表单项组件挂载时
-   `onChange` 当前表单项组件触发 change 事件时
-   `onBlur` 当前表单项组件触发 blur 事件时
-   `onFocus` 当前表单项组件触发 focus 事件时
-   `onSearch` 当前表单项组件触发 search 事件时

除了 `onMount` 外，当 FormService 被触发时 trigger 对应事件的回调函数的参数，会被作为 FormService 的第四个参数（`args`）传给 FormService
