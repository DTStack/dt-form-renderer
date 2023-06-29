<h1 align='center'> 自定义表单控件 </h1>

dt-form-renderer 内置了 ant-design 的所有表单控件，所以你可以直接在配置中直接使用 `Select`、`Input`、`Checkbox` 等控件，而不需要手动引用。但是某些情况下，内置的表单控件并不能满足需求，此时你可能需要自定义表单控件。

自定义表单控件需要遵循以下[约定](https://4x.ant.design/components/form-cn/#components-form-demo-customized-form-controls)

> 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
> 提供 onChange 事件或 trigger 的值同名的事件。

## 如何使用自定义表单控件

声明 `getWidgets` 函数，这个函数接收自定义控件名称，返回自定义组件，然后通过 props 将 `getWidgets` 注入到 `FormRenderer` 中

```jsx
import FormRenderer from 'dt-form-renderer';
import { EditableTable, Editor } from './customWidgets';

function getWidgets(widgetName) {
    switch(widgetName.toLowerCase()) {
        case 'editabletable': {
            return EditableTable;
        }
        case `editor`: {
            return Editor
        }
        default: {
            return Editor
        }
    }
}

function FormDemo () {
    return(
        <FormRenderer
            getWidgets={getWidgets}
            // ...
        >
    )
}
```

然后就可以在 JsonConfig 直接使用了

```json
[
    {
        "fieldName": "code",
        "widget": "Editor"
    },
    {
        "fieldName": "params",
        "widget": "EditableTable"
    }
]
```
