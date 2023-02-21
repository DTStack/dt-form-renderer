import React, { useContext } from 'react';
import { Form } from 'antd'
import getWidget from '../FormWidgets';
import ExtraContext from '../../core/extraDataContext';

const FormItem = Form.Item;

export interface FormItemMeta {
    fieldName: string;
    widget: string;
    label?: (formData, extraData) => boolean;
    widgetProps?: Record<string, any>;
    destroy?: (formData, extraData) => boolean;
    hidden?: (formData, extraData) => boolean;
    rules?: (formData, extraData) => any[];
    colon?: boolean;
    extra?: string;
    hasFeedback: boolean;
    initialValue?: any;
    labelAlign?: 'left'|'right';
    tooltip?: string;
    trigger?: string;
    valuePropName?: string;
}

export interface FormItemWrapperProps {
    formItemMeta: FormItemMeta;
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta } = props
    const {
        widgetProps,
        fieldName,
        label,
        tooltip,
        widget,
        rules,
        initialValue,
        trigger = 'onChange'
    } = formItemMeta
    const extra = useContext(ExtraContext)
    const Widget = getWidget(widget);
    const { hidden, destroy } = formItemMeta;

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                const formData = form.getFieldsValue();
                return !destroy.call?.(null, formData, extra.extraDataRef.current)
                    ? (
                        <FormItem
                            name={fieldName}
                            label={label.call(null, formData, extra.extraDataRef.current)}
                            tooltip={tooltip}
                            rules={rules.call(null, formData, extra.extraDataRef.current)}
                            initialValue={initialValue}
                            hidden={hidden.call(null, formData, extra.extraDataRef.current)}
                            trigger={trigger}
                        >
                            <Widget
                                {...widgetProps}
                                placeholder={widgetProps?.placeholder?.call(null, formData, extra.extraDataRef.current) ?? ''}
                                options={ widgetProps?.options?.call(null, formData, extra.extraDataRef.current) ?? []}
                            />
                        </FormItem>
                    )
                    : null
            }}
        </FormItem>
    )
}

export default FormItemWrapper