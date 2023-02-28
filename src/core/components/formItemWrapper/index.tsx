import React, { useContext, useMemo } from 'react';
import { Form } from 'antd'
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';
import type { ScopeType, TransformedFnType } from '../../expressionParser/fnExpressionTransformer';
import type { FieldItemMetaType } from '../../type';

const { Item: FormItem, useFormInstance } = Form;

export type GetWidgets = (widget: string) => React.ComponentType<any>;
export interface FormItemWrapperProps {
    formItemMeta: FieldItemMetaType;
    getWidgets?: GetWidgets;
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta, getWidgets } = props
    const {
        fieldName,
        widget,
        widgetProps,
        label,
        destroy = false,
        hidden = false,
        rules,
        tooltip,
        initialValue,
        colon,
        extra,
        labelAlign,
        trigger,
        valuePropName,
    } = formItemMeta
    const extraContext = useContext(ExtraContext)
    const form = useFormInstance()

    const Widget = useMemo(() => {
        return getWidgets(widget) ?? internalWidgets(widget)
    }, [widget])

    /**
     * TODO 这里form.getFieldsValue() 的返回值每次都是一个新对象，导致scope一直在变化
     */
    const scope = useMemo<ScopeType>(() => {
        return {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        }
    }, [extraContext.extraDataRef, form.getFieldsValue()])

    const valueGetter = (value: TransformedFnType | unknown) => {
        if (typeof value !== "function") {
            return value
        } else {
            return value.call(null, scope)
        }
    }

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                return !valueGetter(destroy)
                    ? (
                        <FormItem
                            name={fieldName}
                            initialValue={initialValue}
                            tooltip={tooltip}
                            label={valueGetter(label)}
                            rules={valueGetter(rules)}
                            hidden={valueGetter(hidden)}
                            colon={colon}
                            extra={extra}
                            labelAlign={labelAlign}
                            trigger={trigger}
                            valuePropName={valuePropName}
                        >
                            <Widget
                                {...widgetProps}
                                placeholder={valueGetter(widgetProps?.placeholder) ?? ''}
                                options={valueGetter(widgetProps?.options)}
                            />
                        </FormItem>
                    )
                    : null
            }}
        </FormItem>
    )
}

export default FormItemWrapper