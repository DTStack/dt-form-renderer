import React, { useContext, useEffect, useMemo } from 'react';
import { Form, FormInstance } from 'antd';
import ExtraContext from '../../extraDataContext';
import internalWidgets from '../internalWidgets';
import type { ScopeType } from '../../expressionParser/fnExpressionTransformer';
import PubSubCenter from '../../interaction/pubSubCenter';
import {
    FieldItemMetaType,
    ServiceTriggerEnum,
    WidgetPropsType,
} from '../../type';

const { Item: FormItem, useFormInstance } = Form;

export type GetWidgets = (widget: string) => React.ComponentType<any>;
export interface FormItemWrapperProps {
    formItemMeta: FieldItemMetaType;
    getWidgets: GetWidgets;
    publishServiceEvent: PubSubCenter['publishServiceEvent'];
    valueGetter: (value) => any;
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = (props) => {
    const { formItemMeta, getWidgets, publishServiceEvent, valueGetter } =
        props;
    const {
        fieldName,
        valuePropName,
        initialValue,
        label,
        labelAlign,
        widget,
        widgetProps,
        hidden = false,
        rules,
        tooltip,
        colon,
        extra,
        trigger,
        valueDerived,
        servicesTriggers,
    } = formItemMeta;
    const extraContext = useContext(ExtraContext);
    const form = useFormInstance();

    const Widget: any = useMemo(() => {
        return getWidgets(widget) ?? internalWidgets(widget);
    }, [widget]);

    useEffect(() => {
        if (servicesTriggers.includes(ServiceTriggerEnum.onMount)) {
            setTimeout(() => {
                publishServiceEvent(
                    fieldName,
                    ServiceTriggerEnum.onMount,
                    form.getFieldsValue(),
                    extraContext.extraDataRef
                );
            });
        }
    }, []);

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
        if (derivedValue !== form.getFieldValue(fieldName)) {
            setTimeout(() => {
                form.setFieldValue(fieldName, derivedValue);
            });
        }
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
                        args
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
                        args
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
                        args
                    );
                };
            }
        });
        return serviceTriggerProps;
    };

    const widgetPropsGetter = (_widgetProps: WidgetPropsType) => {
        const widgetProps: {} = {};
        Object.entries(_widgetProps).map(([key, value]) => {
            widgetProps[key] = valueGetter(value);
        });
        return widgetProps;
    };

    return (
        <FormItem noStyle shouldUpdate>
            {(form) => {
                deriveValue(form as FormInstance);
                const { onBlur, onFocus, onSearch } = getServiceTriggerProps(
                    form.getFieldsValue(),
                    extraContext.extraDataRef
                );
                const serviceProps = {} as any;
                onBlur && (serviceProps.onBlur = onBlur);
                onFocus && (serviceProps.onFocus = onFocus);
                onSearch && (serviceProps.onSearch = onSearch);
                return (
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
                        validateFirst
                    >
                        <Widget
                            {...widgetPropsGetter(widgetProps)}
                            {...serviceProps}
                        />
                    </FormItem>
                );
            }}
        </FormItem>
    );
};

export default FormItemWrapper;
