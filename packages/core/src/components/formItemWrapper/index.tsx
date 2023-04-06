import React, { useContext, useMemo, useRef } from 'react';
import { Form, FormInstance } from 'antd';
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';
import type {
    ScopeType,
    TransformedFnType,
} from '../../expressionParser/fnExpressionTransformer';
import type { FieldItemMetaType } from '../../type';

const { Item: FormItem } = Form;

export type GetWidgets = (widget: string) => React.ComponentType<any>;
export interface FormItemWrapperProps {
    formItemMeta: FieldItemMetaType;
    getWidgets?: GetWidgets;
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta, getWidgets } = props;
    const {
        fieldName,
        valuePropName,
        initialValue,
        label,
        labelAlign,
        widget,
        widgetProps,
        destroy = false,
        hidden = false,
        rules,
        tooltip,
        colon,
        extra,
        trigger,
        valueDerived,
    } = formItemMeta;
    const derivedValueRef = useRef<undefined>()
    const extraContext = useContext(ExtraContext);

    const Widget: any = useMemo(() => {
        return getWidgets(widget) ?? internalWidgets(widget);
    }, [widget]);

    const genValueGetter = (form: FormInstance) => {
        const scope: ScopeType = {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        } 
        return (value: TransformedFnType | unknown) => {
            if (typeof value !== 'function') {
                return value;
            } else {
                return value.call(null, scope);
            }
        };
    }

    /**
     * 处理派生值的情况
     */
    const deriveValue = (form: FormInstance) => {
        if(valueDerived === null) return
        
        const scope: ScopeType = {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        } 
        const derivedValue = valueDerived(scope);
        console.log(derivedValue) 
        if(derivedValue !== derivedValueRef.current) {
            setTimeout(() => {
                form.setFieldValue(fieldName, derivedValue);
            })
        }
        derivedValueRef.current = derivedValue as any;
    }

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                const valueGetter = genValueGetter(form as FormInstance)
                deriveValue(form as FormInstance)
                return !valueGetter(destroy) ? (
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
                            placeholder={
                                valueGetter(widgetProps?.placeholder) ?? ''
                            }
                            options={valueGetter(widgetProps?.options)}
                        />
                    </FormItem>
                ) : null;
            }}
        </FormItem>
    );
};

export default FormItemWrapper;
