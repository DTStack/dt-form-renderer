<h1 align='center'> 自定义表单控件 </h1>

dt-form-renderer 内置了 ant-design 的所有表单控件，所以你可以直接在配置中直接使用 `Select`、`Input`、`Checkbox` 等控件，而不需要手动引用。但是某些情况下，内置的表单控件并不能满足需求，此时你可能需要自定义表单控件。

自定义表单控件需要遵循以下[约定](https://4x.ant.design/components/form-cn/#components-form-demo-customized-form-controls)

> 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
> 提供 onChange 事件或 trigger 的值同名的事件。

## 内置的表单控件

-   `AutoComplete` ant-design [AutoComplete](https://4x.ant.design/components/auto-complete-cn/) 组件
-   `Cascader` ant-design [Cascader](https://4x.ant.design/components/cascader-cn/) 组件
-   `Checkbox` ant-design [Checkbox](https://4x.ant.design/components/checkbox-cn/) 组件
-   `CheckboxGroup` ant-design [Checkbox#Group](https://4x.ant.design/components/checkbox-cn/#components-checkbox-demo-group) 组件
-   `DatePicker` ant-design [DatePicker](https://4x.ant.design/components/date-picker-cn/) 组件

-   `DateRangePicker` ant-design [DatePicker#RangePicker](https://4x.ant.design/components/date-picker-cn/#RangePicker) 组件
-   `DateTimePicker` ant-design [DatePicker#TimePicker](https://4x.ant.design/components/date-picker-cn/) 组件
-   `YearPicker` ant-design [DatePicker#YearPicker](https://4x.ant.design/components/date-picker-cn/#DatePicker[picker=year]) 组件
-   `MonthPicker` ant-design [DatePicker#MonthPicker](https://4x.ant.design/components/date-picker-cn/#DatePicker[picker=month]) 组件
-   `WeekPicker` ant-design [DatePicker#WeekPicker](https://4x.ant.design/components/date-picker-cn/#DatePicker[picker=week]) 组件
-   `Input` ant-design [Input](https://4x.ant.design/components/input-cn/) 组件
-   `InputGroup` ant-design [Input#Group](https://4x.ant.design/components/input-cn/#Input.Group) 组件
-   `Password` ant-design [Input#Password](https://4x.ant.design/components/input-cn/#Input.Password) 组件
-   `InputSearch` ant-design [Input#Search](https://4x.ant.design/components/input-cn/#Input.Search) 组件
-   `TextArea` ant-design [Input#TextArea](https://4x.ant.design/components/input-cn/#Input.TextArea) 组件
-   `InputNumber` ant-design [InputNumber](https://4x.ant.design/components/input-number-cn/) 组件
-   `Mentions` ant-design [Mentions](https://4x.ant.design/components/mentions-cn/) 组件
-   `Radio` ant-design [Radio](https://4x.ant.design/components/radio-cn/) 组件
-   `RadioButton` ant-design [Radio#Button](https://4x.ant.design/components/radio-cn/#Radio/Radio.Button) 组件
-   `RadioGroup` ant-design [Radio#Group](https://4x.ant.design/components/radio-cn/#RadioGroup) 组件
-   `Rate` ant-design [Rate](https://4x.ant.design/components/rate-cn/) 组件
-   `Select` ant-design [Select](https://4x.ant.design/components/select-cn/) 组件
-   `Slider` ant-design [Slider](https://4x.ant.design/components/slider-cn/) 组件
-   `Switch` ant-design [Switch](https://4x.ant.design/components/switch-cn/) 组件
-   `TimePicker` ant-design [TimePicker](https://4x.ant.design/components/time-picker-cn/) 组件
-   `TimeRangePicker` ant-design [TimePicker#RangePicker](https://4x.ant.design/components/time-picker-cn/#RangePicker) 组件
-   `Transfer` ant-design [Transfer](https://4x.ant.design/components/transfer-cn/) 组件
-   `TreeSelect` ant-design [TreeSelect](https://4x.ant.design/components/tree-select-cn/) 组件
-   `Upload` ant-design [Upload](https://4x.ant.design/components/upload-cn/) 组件

<br/>

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
