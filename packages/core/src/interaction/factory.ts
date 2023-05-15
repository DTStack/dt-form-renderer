import type { FormInstance } from 'antd';
import { UpdateExtraType } from '../extraDataContext';
import type {
    FormServicePoolType,
    JsonConfigFieldType,
    TriggerServiceType,
    IServiceContext,
    FormServiceType,
} from '../type';

/**
 * @description 生成字段联动处理函数
 * @param form form 实例
 * @param effectFields 被影响的字段
 */
export function fieldValueInteractionFactory(
    form: FormInstance,
    effectFields: string[],
    fieldConfList: JsonConfigFieldType[]
) {
    const effectFieldConfList = fieldConfList.filter((fc) =>
        effectFields.includes(fc.fieldName)
    );
    const changedFields: string[] = [];
    const resetValues = effectFieldConfList.reduce((ev, fieldConf) => {
        const { fieldName, initialValue } = fieldConf;
        if (form.getFieldValue(fieldName) !== initialValue) {
            ev[fieldConf.fieldName] = fieldConf.initialValue;
            changedFields.push(fieldName);
        }
        return ev;
    }, {} as any);
    form.setFieldsValue(resetValues);
    return changedFields;
}

/**
 * @description 生成字段值变更触发的 action 函数
 * @param servicePool 服务池
 * @param updateExtra extraData 更新函数
 * @param triggerService 触发的 action 信息
 * @returns
 */
export function triggerServiceFactory(
    servicePool: FormServicePoolType,
    updateExtra: UpdateExtraType,
    triggerService: TriggerServiceType
): FormServiceType {
    const { serviceName, fieldInExtraData } = triggerService;

    const service = servicePool?.[serviceName];

    return (context: IServiceContext) => {
        updateExtra((extraData) => ({
            ...extraData,
            serviceLoading: {
                ...extraData.serviceLoading,
                [serviceName]: true,
            },
        }));
        return service(context).then((res) => {
            updateExtra((extraData) => ({
                ...extraData,
                [fieldInExtraData]: res,
                serviceLoading: {
                    ...extraData.serviceLoading,
                    [serviceName]: false,
                },
            }));
        });
    };
}
