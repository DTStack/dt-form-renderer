import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'antd';
import FormItemWrapper, { FormItemMeta, GetWidgets } from '../formItemWrapper';
import ExtraContext, { useExtraData, IExtraDataRef } from '../../extraDataContext';
import JsonConfigTransformer from '../../expressionParser';
import PubSubCenter from '../../interaction/pubSubCenter';
import InteractionSubscriber from '../../interaction/interactionSubscriber';
import type { FormServicePool, FormItemRuleMap, IDocsMap } from '../support-type';
import type { FormInstance } from 'antd/es/form/Form';

const { useForm } = Form;

interface FormRendererProps {
    parsedJson: any[];
    formServicePool: FormServicePool;
    ruleMap: FormItemRuleMap;
    docsMap: IDocsMap;
    className?: string;
    style?: React.CSSProperties;
    defaultExtraData: Record<string, any>;
    preserveFormItems?: (form: FormInstance, extraDataRef: IExtraDataRef) => React.ReactNode;
    preserveFields?: string[];
    getWidgets?: GetWidgets;
}

const FormRenderer: React.FC<FormRendererProps> = (props) => {
    const { parsedJson, formServicePool, defaultExtraData, ruleMap, preserveFormItems, preserveFields, getWidgets, docsMap, style, className } = props;
    const [ form ] = useForm()
    const [ extraDataRef, updateExtraData ] = useExtraData({})
    const [ formItems, updateFormItems ] = useState<FormItemMeta[]>([])
    const pubSubCenterRef = useRef<PubSubCenter>(null)
    const existFieldsRef = useRef<string[]>([])

    useEffect(() => {
        /**
         * 处理联动关系，订阅事件
         */
        updateExtraData(defaultExtraData)
        const jsonConfigTransformer = new JsonConfigTransformer(parsedJson, ruleMap, docsMap)
        updateFormItems(jsonConfigTransformer.transform())
        /** 初始化发布订阅池 */
        const pubSubCenter = new PubSubCenter();
        /** 初始化订阅器 */
        const subscriber = new InteractionSubscriber(form, pubSubCenter, { extraDataRef, update: updateExtraData }, formServicePool)
        /** 订阅 parsedJson 中声明的 dependencies 和 triggerAction */
        subscriber.subscribe(parsedJson)
        pubSubCenterRef.current = pubSubCenter;
    
        return () => {
            pubSubCenter.dispose();
            subscriber.dispose();
            const fixedValues = form.getFieldsValue(preserveFields)
            pubSubCenterRef.current = null;
            existFieldsRef.current = [];

            setTimeout(() => {
                form.resetFields();
                form.setFieldsValue(fixedValues)
            })
        }
    }, [parsedJson])

    useEffect(() => {
        /**
         * 处理切换数据源时，要触发的 action
         */
        setTimeout(() => { // 延迟调用，保证所有的formItem组件此时已经挂载
            const currentFields = Object.keys(form.getFieldsValue());
            currentFields.forEach(mf => pubSubCenterRef.current.publishImmediateTriggerEvent(mf, form.getFieldsValue(), extraDataRef))
        })
    }, [formItems])

    useEffect(() => {
        /**
         * 处理不切换数据源的情况下，某些字段从 销毁状态 到 挂载状态 时要触发的 action
         */
        const currentFields = Object.keys(form.getFieldsValue());
        const prevFields = existFieldsRef.current;
        const mountFields = currentFields.filter(f => !prevFields.includes(f))
        /** 当某些字段挂载时触发 Immediate Action */
        if(mountFields.length && existFieldsRef.current.length) {
            setTimeout(() => {
                mountFields.forEach(mf => pubSubCenterRef.current.publishImmediateTriggerEvent(mf, form.getFieldsValue(), extraDataRef))
            })
        }
        existFieldsRef.current = currentFields;
    }, [form.getFieldsValue(), extraDataRef.current])

    const onValuesChange = (changedValues) => {
        const changedFields = Object.keys(changedValues);
        changedFields.forEach(fieldName => {
            // 处理字段值之间的联动关系
            pubSubCenterRef.current.publishDepEvent(fieldName)
            // 处理字段触发的 action
            pubSubCenterRef.current.publishTriggerEvent(fieldName, form.getFieldsValue(), extraDataRef)
        });
    }

    return (
        <ExtraContext.Provider value={{ extraDataRef, update: updateExtraData }}>
            <Form 
                {...formLayout}
                form={form}
                style={style}
                onValuesChange={onValuesChange}
                className={className}
                preserve={false}
            >
                <ExtraContext.Consumer>
                    {
                        (extraDataContext) => {
                            return preserveFormItems?.(form, extraDataContext.extraDataRef)
                        }
                    }
                </ExtraContext.Consumer>
                {
                    formItems.map((formItemMeta) => {
                        return <FormItemWrapper 
                            getWidgets={getWidgets}
                            key={formItemMeta.fieldName}
                            formItemMeta={formItemMeta}
                        />
                    })  
                }
            </Form>
        </ExtraContext.Provider>
    )
}

export default FormRenderer;

const formLayout: any = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};