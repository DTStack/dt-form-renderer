import React, { useContext, useMemo, useRef } from 'react';
import { Form, FormInstance } from 'antd';
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';
import type {
    ScopeType,
    TransformedFnType,
} from '../../expressionParser/fnExpressionTransformer';
import PubSubCenter from '@/interaction/pubSubCenter';
import { FieldItemMetaType, ServiceTriggerEnum, WidgetPropsType } from '../../type';

const { Item: FormItem } = Form;

export type GetWidgets = (widget: string) => React.ComponentType<any>;
export interface FormItemWrapperProps {
    formItemMeta: FieldItemMetaType;
    getWidgets: GetWidgets;
    publishServiceEvent: PubSubCenter['publishServiceEvent'];
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta, getWidgets, publishServiceEvent } = props;
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
        servicesTriggers,
    } = formItemMeta;
    const derivedValueRef = useRef<undefined>();
    const extraContext = useContext(ExtraContext);

    const Widget: any = useMemo(() => {
        return getWidgets(widget) ?? internalWidgets(widget);
    }, [widget]);

    const genValueGetter = (form: FormInstance) => {
        const scope: ScopeType = {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        };
        return (value: TransformedFnType | unknown) => {
            if (typeof value !== 'function') {
                return value;
            } else {
                return value.call(null, scope);
            }
        };
    };

    /**
     * 处理派生值的情况
     */
    const deriveValue = (form: FormInstance) => {
        if (valueDerived === null) return;

        const scope: ScopeType = {
            formData: form.getFieldsValue(),
            extraDataRef: extraContext.extraDataRef,
        };
        const derivedValue = valueDerived(scope);
        if (derivedValue !== derivedValueRef.current) {
            setTimeout(() => {
                form.setFieldValue(fieldName, derivedValue);
            });
        }
        derivedValueRef.current = derivedValue as any;
    };

    const getServiceTriggerProps = (formData, extraData) => {
        const serviceTriggerProps = {
            onBlur: null,
            onFocus: null,
            onSearch: null,
        };
        servicesTriggers.forEach((trigger) => {
            if (trigger === ServiceTriggerEnum.onFocus) {
                serviceTriggerProps.onFocus = (...args: any[]) => {
                    publishServiceEvent(
                        fieldName,
                        ServiceTriggerEnum.onFocus,
                        formData,
                        extraData,
                        args,
                    );
                };
            }
            if (trigger === ServiceTriggerEnum.onBlur) {
                serviceTriggerProps.onBlur = (...args: any[]) => {
                    publishServiceEvent(
                        fieldName,
                        ServiceTriggerEnum.onBlur,
                        formData,
                        extraData,
                        args,
                    );
                };
            }
            if (trigger === ServiceTriggerEnum.onSearch) {
                serviceTriggerProps.onSearch = (...args: any[]) => {
                    publishServiceEvent(
                        fieldName,
                        ServiceTriggerEnum.onSearch,
                        formData,
                        extraData,
                        args,
                    );
                };
            }
        });
        return serviceTriggerProps;
    };

    const widgetPropsGetter = (valueGetter: ReturnType<typeof genValueGetter>, _widgetProps: WidgetPropsType) => {
        const widgetProps: {} = {};
        Object.entries(_widgetProps).map(([key, value]) => {
            widgetProps[key] = valueGetter(value);
        })
        return widgetProps
    }

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                const valueGetter = genValueGetter(form as FormInstance);
                deriveValue(form as FormInstance);
                const { onBlur, onFocus, onSearch } = getServiceTriggerProps(
                    form.getFieldsValue(),
                    extraContext.extraDataRef.current,
                );
                const serviceProps = {} as any;
                onBlur && (serviceProps.onBlur = onBlur);
                onFocus && (serviceProps.onFocus = onFocus);
                onSearch && (serviceProps.onSearch = onSearch);
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
                            {...widgetPropsGetter(valueGetter, widgetProps)}
                            {...serviceProps}
                        />
                    </FormItem>
                ) : null;
            }}
        </FormItem>
    );
};

export default FormItemWrapper;
