import React, { useContext, useMemo } from 'react';
import { Form } from 'antd'
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';
import { IScope } from '../../expressionParser/fnExpressionTransformer';

const { Item: FormItem, useFormInstance } = Form;

export interface FormItemMeta {
    fieldName: string;
    widget: string;
    widgetProps?: Record<string, any>;
    label?: (formData, extraData) => boolean;
    destroy?: (formData, extraData) => boolean;
    hidden?: (formData, extraData) => boolean;
    rules?: (formData, extraData) => any[];
    tooltip?: string;
    colon?: boolean;
    extra?: string;
    initialValue?: any;
    labelAlign?: 'left'|'right';
    trigger?: string;
    valuePropName?: string;
}

export type GetWidgets = (widget: string) => React.ComponentType<any>;

export interface FormItemWrapperProps {
    formItemMeta: FormItemMeta;
    getWidgets?: GetWidgets;
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta, getWidgets } = props
    const {
        fieldName ,
        widget ,
        widgetProps ,
        label ,
        destroy = false,
        hidden = false,
        rules ,
        tooltip ,
        initialValue ,
        colon ,
        extra,
        labelAlign ,
        trigger ,
        valuePropName ,
    } = formItemMeta
    const extraContext = useContext(ExtraContext)
    const form = useFormInstance()

    const Widget = useMemo(() => {
        return getWidgets(widget) ?? internalWidgets(widget)
    }, [widget]) 

    const scope = useMemo<IScope>(() => {
       return {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        }
    }, [extraContext.extraDataRef, form.getFieldsValue()])

    const valueGetter = (value) => {
        if(typeof value !== "function") {
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