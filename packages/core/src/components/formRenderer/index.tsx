import React, { useState, useEffect, useRef, useImperativeHandle, useLayoutEffect } from 'react';
import { Form } from 'antd';
import type { FormInstance, FormProps } from 'antd/es/form/Form';
import type {
    FormServicePoolType,
    FormItemRuleMapType,
    DocsMapType,
    FieldItemMetaType,
    JsonConfigType
} from '../../type';
import FormItemWrapper, { GetWidgets } from '../formItemWrapper';
import ExtraContext, {
    useExtraData,
    ExtraDataRefType,
} from '../../extraDataContext';
import JsonConfigTransformer from '../../expressionParser/jsonConfigTransformer';
import PubSubCenter from '../../interaction/pubSubCenter';
import InteractionSubscriber from '../../interaction/interactionSubscriber';

const { useForm } = Form;

export interface FormRendererProps extends FormProps {
    jsonConfig: JsonConfigType;
    formServicePool: FormServicePoolType;
    ruleMap: FormItemRuleMapType;
    docsMap: DocsMapType;
    defaultExtraData: Record<string, any>;
    preserveFormItems?: (
        form: FormInstance,
        extraDataRef: ExtraDataRefType,
    ) => React.ReactNode;
    preserveFields?: string[];
    getWidgets?: GetWidgets;
}

const FormRenderer: React.ForwardRefRenderFunction<
    FormInstance,
    FormRendererProps
> = (props, ref) => {
    const {
        jsonConfig,
        formServicePool,
        defaultExtraData,
        ruleMap,
        preserveFormItems,
        preserveFields,
        getWidgets,
        docsMap,
        initialValues,
        ...restProps
    } = props;
    const [form] = useForm();
    const [extraDataRef, updateExtraData] = useExtraData({});
    const [formItemsMeta, updateFormItems] = useState<FieldItemMetaType[]>([]);
    const pubSubCenterRef = useRef<PubSubCenter>(null);
    const mountedFieldsRef = useRef<string[]>([]);

    useImperativeHandle(ref, () => form, [form]);

    /**
     * 切换数据源时处理联动关系，订阅事件
     */
    useLayoutEffect(() => {
        updateExtraData(defaultExtraData);
        const fieldList = jsonConfig?.fieldList ?? []
        const jsonConfigTransformer = new JsonConfigTransformer(
            fieldList,
            ruleMap,
            docsMap,
        );
        updateFormItems(jsonConfigTransformer.transform() as any);
        /** 初始化发布订阅池 */
        const pubSubCenter = new PubSubCenter();
        /** 初始化订阅器 */
        const subscriber = new InteractionSubscriber(
            form,
            pubSubCenter,
            { extraDataRef, update: updateExtraData },
            formServicePool,
        );
        /** 订阅 jsonConfig 中声明的 dependencies 和 triggerAction */
        subscriber.subscribe(fieldList);
        pubSubCenterRef.current = pubSubCenter;
        form.setFieldsValue(initialValues);
        return () => {
            pubSubCenter.dispose();
            subscriber.dispose();
            const fixedValues = form.getFieldsValue(preserveFields);
            pubSubCenterRef.current = null;
            mountedFieldsRef.current = [];

            setTimeout(() => {
                form.resetFields();
                form.setFieldsValue(fixedValues);
            });
        };
    }, [jsonConfig]);

    /**
     * 处理切换数据源时，要触发的 action
     */
    useEffect(() => {
        setTimeout(() => {
            // 延迟调用，保证所有的formItem组件此时已经挂载
            const currentFields = Object.keys(form.getFieldsValue());
            currentFields.forEach((mf) =>
                pubSubCenterRef.current.publishImmediateTriggerEvent(
                    mf,
                    form.getFieldsValue(),
                    extraDataRef,
                ),
            );
        });
    }, [jsonConfig]);

    /**
     * defaultExtraData 变化时，更新到 extraDataContext 中
     */
    useEffect(() => {
        /** 延迟调用，避免切换数据源时，之前的 extraData 没有清空 */
        setTimeout(() => {
            updateExtraData({...extraDataRef.current, ...defaultExtraData});
        })
    }, [defaultExtraData])

    /**
     * 处理不切换数据源的情况下，某些字段从销毁状态到挂载状态时要触发的 action
     */
    useEffect(() => {
        const currentFields = Object.keys(form.getFieldsValue());
        const mountedFields = mountedFieldsRef.current;
        const willMountFields = currentFields.filter(
            (f) => !mountedFields.includes(f),
        );
        /** 当某些字段挂载时触发 Immediate Action */
        if (willMountFields.length && mountedFieldsRef.current.length) {
            setTimeout(() => {
                willMountFields.forEach((mf) =>
                    pubSubCenterRef.current.publishImmediateTriggerEvent(
                        mf,
                        form.getFieldsValue(),
                        extraDataRef,
                    ),
                );
            });
        }
        mountedFieldsRef.current = currentFields;
    }, [form.getFieldsValue(), extraDataRef.current]);

    const onValuesChange = (changedValues, ...restArgs) => {
        const changedFields = Object.keys(changedValues);
        console.log(changedValues) 
        changedFields.forEach((fieldName) => {
            // 处理字段值之间的联动关系, 发布 字段值变更事件
            pubSubCenterRef.current.publishDepEvent(fieldName);
            // 处理字段触发的 action， 发布 字段值变更事件
            pubSubCenterRef.current.publishTriggerEvent (
                fieldName,
                form.getFieldsValue(),
                extraDataRef,
            );
        });
        props.onValuesChange?.(changedValues, restArgs);
    };

    return (
        <ExtraContext.Provider
            value={{ extraDataRef, update: updateExtraData }}
        >
            <Form
                {...restProps}
                form={form}
                onValuesChange={onValuesChange}
                preserve={false}
            >
                <ExtraContext.Consumer>
                    {(extraDataContext) => {
                        return preserveFormItems?.(
                            form,
                            extraDataContext.extraDataRef,
                        );
                    }}
                </ExtraContext.Consumer>
                {formItemsMeta.map((formItemMeta) => {
                    return (
                        <FormItemWrapper
                            getWidgets={getWidgets}
                            key={formItemMeta.fieldName}
                            formItemMeta={formItemMeta}
                        />
                    );
                })}
            </Form>
        </ExtraContext.Provider>
    );
};

export default React.forwardRef(FormRenderer);
