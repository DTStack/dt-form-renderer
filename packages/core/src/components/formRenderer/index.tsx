import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
} from 'react';
import { Form } from 'antd';
import type { FormInstance, FormProps } from 'antd/es/form/Form';
import type {
    FormServicePoolType,
    FormItemRuleMapType,
    DocsMapType,
    FieldItemMetaType,
    JsonConfigType,
} from '../../type';
import { ServiceTriggerEnum } from '../../type';
import FormItemWrapper, { GetWidgets } from '../formItemWrapper';
import ExtraContext, { useExtraData } from '../../extraDataContext';
import JsonConfigTransformer from '../../expressionParser/jsonConfigTransformer';
import PubSubCenter from '../../interaction/pubSubCenter';
import InteractionSubscriber from '../../interaction/interactionSubscriber';
import type { ScopeType } from '../../expressionParser/fnExpressionTransformer';

const { useForm } = Form;

export interface FormRendererProps extends FormProps {
    jsonConfig: JsonConfigType;
    formServicePool?: FormServicePoolType;
    ruleMap?: FormItemRuleMapType;
    docsMap?: DocsMapType;
    getWidgets?: GetWidgets;
    defaultExtraData: Record<string, any>;
    preserveFields?: string[];
    debounceSearch?: boolean;
    header?:
        | React.ReactNode
        | ((form: FormInstance, extraData: any) => React.ReactNode);
    footer?:
        | React.ReactNode
        | ((form: FormInstance, extraData: any) => React.ReactNode);
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
        preserveFields,
        getWidgets,
        docsMap,
        initialValues,
        header,
        footer,
        debounceSearch,
        ...restProps
    } = props;
    const [form] = useForm();
    const [extraDataRef, updateExtraData] = useExtraData({
        serviceLoading: {},
    });
    const [formItemsMeta, updateFormItems] = useState<FieldItemMetaType[]>([]);
    const pubSubCenterRef = useRef<PubSubCenter>(null);

    useImperativeHandle(ref, () => form, [form]);

    /**
     * 切换数据源时处理联动关系，订阅事件
     */
    useLayoutEffect(() => {
        updateExtraData(defaultExtraData);
        const fieldList = jsonConfig?.fieldList ?? [];
        const jsonConfigTransformer = new JsonConfigTransformer(
            fieldList,
            ruleMap,
            docsMap
        );
        updateFormItems(jsonConfigTransformer.transform() as any);
        /** 初始化发布订阅池 */
        const pubSubCenter = new PubSubCenter();
        /** 初始化订阅器 */
        const subscriber = new InteractionSubscriber(
            form,
            pubSubCenter,
            { extraDataRef, update: updateExtraData },
            formServicePool
        );
        /** 订阅 jsonConfig 中声明的 dependencies 和 triggerService */
        subscriber.subscribe(fieldList);
        pubSubCenterRef.current = pubSubCenter;
        form.setFieldsValue(initialValues);
        return () => {
            pubSubCenter.dispose();
            subscriber.dispose();
            const preserveValues = form.getFieldsValue(preserveFields);
            pubSubCenterRef.current = null;
            form.resetFields();
            form.setFieldsValue(preserveValues);
        };
    }, [jsonConfig]);

    /**
     * defaultExtraData 变化时，更新到 extraDataContext 中
     */
    useEffect(() => {
        // 延迟调用，避免 jsonConfig 变化时，原有的 extraData 没有清空
        setTimeout(() => {
            updateExtraData({ ...extraDataRef.current, ...defaultExtraData });
        });
    }, [defaultExtraData]);

    const valueGetter = (value) => {
        const scope: ScopeType = {
            formData: form.getFieldsValue(),
            extraDataRef,
        };
        if (typeof value !== 'function') {
            return value;
        } else {
            return value(scope);
        }
    };

    const shouldRenderFieldsMeta = useMemo(() => {
        return formItemsMeta
            .map((item) => {
                if (valueGetter(item.destroy)) {
                    return null;
                }
                return item;
            })
            .filter(Boolean);
    }, [formItemsMeta, valueGetter]);

    const onValuesChange = (changedValues, formData) => {
        const changedFields = Object.keys(changedValues);
        changedFields.forEach((fieldName) => {
            // 处理字段值之间的联动关系, 发布 字段值变更事件
            const changedFields =
                pubSubCenterRef.current.publishDepEvent(fieldName);

            const allPubServiceFields = [fieldName, ...changedFields].filter(
                (name) =>
                    shouldRenderFieldsMeta.some(
                        (item) => item.fieldName === name
                    )
            );

            pubSubCenterRef.current.batchPublishServiceEvent(
                allPubServiceFields,
                ServiceTriggerEnum.onChange,
                form.getFieldsValue(),
                extraDataRef
            );
        });
        props.onValuesChange?.(changedValues, formData);
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
                {typeof header === 'function'
                    ? header?.(form, extraDataRef.current)
                    : header}
                {shouldRenderFieldsMeta.map((formItemMeta) => {
                    return (
                        <FormItemWrapper
                            debounceSearch={debounceSearch}
                            valueGetter={valueGetter}
                            getWidgets={getWidgets}
                            key={formItemMeta.fieldName}
                            formItemMeta={formItemMeta}
                            publishServiceEvent={
                                pubSubCenterRef.current.publishServiceEvent
                            }
                        />
                    );
                })}
                {typeof footer === 'function'
                    ? footer?.(form, extraDataRef.current)
                    : footer}
            </Form>
        </ExtraContext.Provider>
    );
};

export default React.forwardRef(FormRenderer);
