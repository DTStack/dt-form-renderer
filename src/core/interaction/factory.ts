import type { FormInstance } from "antd";
import type { FormServicePoolType } from '../type'

/**
 * @description 生成字段联动处理函数
 * @param form form 实例
 * @param effectFields 被影响的字段
 * 目前字段联动只做清空处理
 */
export function fieldValueInteractionFactory (form: FormInstance, effectFields: string[]) {
    const emptyValue = effectFields.reduce((ev, field) => {
        ev[field] = undefined;
        return ev
    }, {} as any)
    return form.setFieldsValue(emptyValue)
}

interface IActionConf {
    serviceName: string;
    fieldInExtraData: string;
    immediate: boolean;
}

/**
 * @description 生成字段值变更触发的 action 函数
 * @param servicePool 服务池
 * @param updateExtra extraData 更新函数
 * @param triggerAction 触发的 action 信息
 * @returns 
 */
export function triggerServiceFactory (servicePool: FormServicePoolType, updateExtra, triggerAction: IActionConf) {
    const {
        serviceName,
        fieldInExtraData,
    } = triggerAction;

    const service = servicePool?.[serviceName];

    return (formData, extraData) => {
        service.call(null, formData, extraData)
        .then((res) => {
            updateExtra((extraData) => ({ ...extraData, [fieldInExtraData]: res }))
        })
    }
}