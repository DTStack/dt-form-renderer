<h1 align='center'> dt-form-renderer </h1>

<hr>

-   一个基于 React 和 Ant-Design 的表单渲染器
-   使用 JSON 描述表单
-   支持复杂的联动逻辑

## 安装

使用 npm

```shell
npm install dt-form-renderer
```

使用 yarn

```shell
yarn add dt-form-renderer
```

使用 pnpm

```shell
pnpm install dt-form-renderer
```

<br/>

## 文档

-   [FormRenderer 组件](./docs/FormRenderer.md)
-   [JSON 配置](./docs//JsonConfig.md)
-   [表达式](./docs/Expression.md)
-   [表单联动](./docs/Interaction.md)
-   [自定义表单控件](./docs/Widget.md)
-   [表单 Service](./docs/FormService.md)

<br/>

## 使用

组件

```jsx
import React, { useRef } from 'react';
import FormRenderer from 'dt-form-renderer';
import jsonConfig from './jsonConfig';

function FormDemo () {

    const formRef = useRef();

    return (
        <FormRenderer
            ref={formRef}
            onValuesChange={(...args) => console.log(args)}
            initialValues={{}}
            jsonConfig={}
            defaultExtraData={{}}
        />
    )
}
```

表单配置

```js
const jsonConfig = {
    description: '这是一份表单配置',
    fieldList: [
        {
            fieldName: 'schema',
            label: 'schema',
            widget: 'Select',
            widgetProps: {
                placeholder: '请选择schema',
                options: [],
                allowClear: true,
            },
        },
        {
            fieldName: 'tableName',
            label: '表名',
            dependencies: ['schema'],
            widget: 'Select',
            widgetProps: {
                options: [],
                placeholder: '请选择表名',
            },
            rules: [
                {
                    required: true,
                    message: '请选择表名！',
                },
            ],
        },
    ],
};

export default jsonConfig;
```

## 在线编辑

[PlayGround](https://dtstack.github.io/dt-form-renderer/)
