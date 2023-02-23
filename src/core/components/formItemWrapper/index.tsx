import React, { useContext } from 'react';
import { Form } from 'antd'
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';

const FormItem = Form.Item;

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
    const Widget = getWidgets(widget) ?? internalWidgets(widget);

    const executor = (formData, value) => {
        if(typeof value !== "function") {
            return value
        } else {
            return value.call(null, formData, extraContext.extraDataRef.current)
        }
    }

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                const formData = form.getFieldsValue();
                const exec = executor.bind(null, formData)
                return !exec(destroy)
                    ? (
                        <FormItem
                            name={fieldName}
                            initialValue={initialValue}
                            tooltip={tooltip}
                            label={exec(label)}
                            rules={exec(rules)}
                            hidden={exec(hidden)}
                            colon={colon}
                            extra={extra}
                            labelAlign={labelAlign}
                            trigger={trigger}
                            valuePropName={valuePropName}
                        >
                            <Widget
                                {...widgetProps}
                                placeholder={exec(widgetProps?.placeholder)  ?? ''}
                                options={exec(widgetProps?.options) ?? []}
                            />
                        </FormItem>
                    )
                    : null
            }}
        </FormItem>
    )
}

export default FormItemWrapper