import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'antd';
import FormItemWrapper, { FormItemMeta } from '../formItemWrapper';
import ExtraContext, { useExtraData } from '../../core/extraDataContext';
import JsonConfigTransformer from '../../core/expressionParser';
import PubSubCenter from '../../core/interaction/pubSubCenter';
import InteractionSubscriber from '../../core/interaction/interactionSubscriber';
import { FormServicePool, FormItemRuleMap } from '../../core/services/serviceType';

const { useForm } = Form;

interface FormRendererProps {
    parsedJson: any[];
    formServicePool: FormServicePool;
    ruleMap: FormItemRuleMap;
    className: string;
    defaultExtraData: Record<string, any>
}

const FormRender: React.FC<FormRendererProps> = (props) => {
    const { parsedJson, formServicePool, defaultExtraData, ruleMap } = props;
    const [ form ] = useForm()
    const [ extraDataRef, updateExtraData ] = useExtraData(defaultExtraData)
    const [ formItems, updateFormItems ] = useState<FormItemMeta[]>([])
    const pubSubCenterRef = useRef<PubSubCenter>(null)
    const existFieldsRef = useRef<string[]>([])

    useEffect(() => {
        const jsonConfigTransformer = new JsonConfigTransformer(parsedJson, ruleMap)
        updateFormItems(jsonConfigTransformer.transform())
        /** 初始化发布订阅池 */
        const pubSubCenter = new PubSubCenter();
        /** 初始化订阅器 */
        const subscriber = new InteractionSubscriber(form, pubSubCenter, { extraDataRef, update: updateExtraData }, formServicePool)
        /** 订阅 json 中声明的 dependencies 和 action */
        subscriber.subscribe(parsedJson)
        pubSubCenterRef.current = pubSubCenter;
        return () => {
            form.resetFields();
            pubSubCenter.dispose();
            subscriber.dispose();
        }
    }, [parsedJson, formServicePool, ruleMap])

    useEffect(() => {
        const currentFields = Object.keys(form.getFieldsValue());
        const prevFields = existFieldsRef.current;
        const mountFields = currentFields.filter(f => !prevFields.includes(f))
        existFieldsRef.current = currentFields;
        /** 当某些字段挂载时触发  Immediate Action*/
        if(mountFields.length) {
            setTimeout(() => {
                mountFields.forEach(mf => pubSubCenterRef.current.publishImmediateTriggerEvent(mf, form.getFieldsValue(), extraDataRef))
            })
        }
    }, [form.getFieldsValue()])


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
                style={{ width: 600 }}
                onValuesChange={onValuesChange}
                className={props.className}
                preserve={false}
            >
                {
                    formItems.map((formItemMeta) => {
                        return <FormItemWrapper 
                            key={formItemMeta.fieldName}
                            formItemMeta={formItemMeta}
                        />
                    })  
                }
            </Form>
        </ExtraContext.Provider>
    )
}

export default FormRender;

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