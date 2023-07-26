<h1 align='center'> FormRenderer 组件 </h1>

`FormRenderer` 组件强依赖于 [ant-design#Form](https://ant.design/components/form-cn#form) 组件，所以它支持 [ant-design#Form](https://ant.design/components/form-cn#form) 的所有 API。除此之外，为了实现 `表单联动` 和 `完全基于 JSON 渲染` 等特性，在 ant-desgin Form Props 的基础上，还有一些额外的 props。

<br/>

## FormRenderer Props

-   `jsonConfig` 解析后的表单 json 配置，详情看[这里](./JsonConfig.md)
-   `formServicePool` FormService 的集合，详情看[这里](./FormService.md)
-   `ruleMap` 自定义的表单校验器的集合
-   `docsMap` 自定义的 tooltip 的集合
-   `getWidgets` 接收表单自定义组件的名称，返回表单自定义组件，详情看[这里](./Widget.md)
-   `defaultExtraData` 默认的 extraData, 详情看[这里](./FormService.md)
-   `header` 固定渲染在表单头部的组件
-   `footer` 固定渲染在表单尾部的组件
-   `debounceSearch` 表单项组件的 `onSearch` 回调是否需要防抖

<br/>

## FormRenderer 的一些默认行为

### 更新

-   如果 jsonConfig 的值更新，那么整个表单都会根据新的 jsonConfig 进行渲染，表单的值，内部的各种状态都会重置，也包括表单已经收集到的所有表单数据。
-   传入 FormRenderer 组件的 `defaultExtraData` 的值发生改变时，表单内部的 extraData 也会随之更新。

### preserve

内置 `preserve` 固定为 `false`，即字段被删除时，不保留字段值。

### onValuesChange

`onValuesChange` 回调的第一个参数为 `changeValues` ，它只包含由用户交互直接引起的数据变更，表单联动的导致的数据变更不包含在内。

### ref

通过 ref 可以拿到 FormRenderer 内部的 ant-design form 实例。
