<h1 align='center'> 表单联动 </h1>
dt-form-renderer 内置支持复杂的表单联动，表单的联动关系大致分为两类：表单UI联动和表单数据联动。

## 表单 UI 联动

表单的 UI 联动包括表单项的现实与隐藏、表单项的 label 文案、表单项组件的 placeholder 等，这些功能都通过[函数表达式](./Expression.md#函数表达式)实现。

### 控制表单项的显示与隐藏

控制表单项的显示与隐藏通过表单项配置的 `hidden` 和 `destroy` 字段实现。`hidden` 字段为 true 时，表单项不再渲染，但是表单项对应的字段值不会被删除。 `destroy` 字段为 true 时，表单项不再渲染，表单项对应的值也会被删除。

```json
[
    {
        "fieldName": "type",
        "widget": "RadioGroup",
        "widgetProps": {
            "options": [
                { "label": "type1", "value": 1 },
                { "label": "type2", "value": 2 }
            ]
        }
    },
    {
        "fieldName": "foo",
        "widget": "input",
        "hidden": "{{ formData.type !== 1 }}"
    },
    {
        "fieldName": "bar",
        "widget": "input",
        "destroy": "{{ formData.type !== 2 }}"
    }
]
```

### 控制表单项的渲染

表单项配置中的 `label` 和 `widgetProps` 都支持函数表达式，通过函数表达式，可以让表单项根据数据渲染

```json
[
    {
        "fieldName": "size",
        "widget": "InputNumber"
    },
    {
        "fieldName": "foo",
        "widget": "input",
        "label": "{{ formData.size > 100 ? 'large' : 'small' }}",
        "widgetProps": {
            "style": "{{ { width: formData.size } }}"
        }
    }
]
```

## 表单数据联动

### dependencies

表单基本的数据联动通过表单项配置中的 `dependencies` 字段来实现，当 `dependencies` 中的字段更新时，本字段的数据会被重置。
比如现在有如下场景，表单中有三个选择器，分别对应 `database（数据库实例）`、`schema`、`table`，三个选择器之间的数据联动关系如下：

-   选择 database 后，对应的 schema 和 table 选择器的值应当被重置
-   选择 schema 后， 对应 table 选择器的值应当被重置

那么对应配置如下所示：

```json
[
    {
        "fieldName": "database",
        "widget": "Select"
    },
    {
        "fieldName": "schema",
        "widget": "Select",
        "dependencies": ["database"]
    },
    {
        "fieldName": "table",
        "widget": "Select",
        "dependencies": ["schema"]
    }
]
```

需要注意的是，`dependencies` 具有传染性，比如上例中，当 `database` 的值发生改变时，`schema` 的值也会发生改变（被重置），由于 `table` 依赖于 `schema`，此时`table` 的值也会被重置。所以上例中即使 `table` 没有直接依赖 `database`，但是当 `database` 的值变化时，仍然会引起`table` 的值被重置

<br/>

### valueDerived

`valueDerived` 主要是为了解决表单项的值来源于其他数据而不是用户输入的情况。比如有一个选择用户的选择器，这个用户的选择器只负责收集用户的 id，但是同时我们希望在选择了用户后同时收集用户名，那么可以这样配置

```json
[
    {
        "fieldName": "userId",
        "label": "用户",
        "widget": "Select",
        "widgetProps": {
            "options": "{{ extraData.userList }}",
            "placeholder": "请选择用户"
        },
        "triggerServices": [
            {
                "serviceName": "getUserList",
                "fieldInExtraData": "userList",
                "trigger": "onMount"
            }
        ]
    },
    {
        "fieldName": "userName",
        "label": "用户名",
        "hidden": true,
        "widget": "Input",
        "valueDerived": "{{ extraData.userList.find(u => u.id === formData.userId)?.userName }}}"
    }
]
```

这样就可以做到收集 `userId` 的同时也收集 `userName`。
**需要注意的是，由于 `valueDerived` 对应的函数表达式可能依赖 formData，所以它对应的值的更新会有延迟，也就是说，在 FormRenderer 的 onValuesChange 回调中，无法获取到最新的 `valueDerived` 对应的的值**。
