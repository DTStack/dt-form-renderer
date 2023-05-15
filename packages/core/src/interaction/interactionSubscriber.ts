import { FormInstance } from 'antd';
import PubSubCenter, { IServiceEvent } from './pubSubCenter';
import { fieldValueInteractionFactory, triggerServiceFactory } from './factory';
import {
    FormServicePoolType,
    JsonConfigFieldType,
    ServiceTriggerEnum,
    TriggerServiceType,
    FormServiceType,
} from '../type';
import { ExtraContextType } from '../extraDataContext';

export default class InteractionSubscriber {
    private _fieldConfList: JsonConfigFieldType[] = null;
    private _pubSubCenter: PubSubCenter = null;
    private _formInstance: FormInstance = null;
    private _triggerServiceFactory: (
        serviceConf: TriggerServiceType
    ) => FormServiceType = null;

    constructor(
        formInstance: FormInstance,
        pubSubCenter: PubSubCenter,
        extraContext: ExtraContextType,
        formServicePool: FormServicePoolType
    ) {
        this._formInstance = formInstance;
        this._pubSubCenter = pubSubCenter;
        this._triggerServiceFactory = triggerServiceFactory.bind(
            null,
            formServicePool,
            extraContext.update
        );
    }

    dispose() {
        this._fieldConfList = null;
        this._formInstance = null;
        this._pubSubCenter.dispose();
        this._triggerServiceFactory = null;
    }

    /**
     * 获取一个字段的变化会影响哪些字段 包括直接和间接影响
     * 生成对应的依赖图
     */
    private getFieldsDependGraph() {
        const dependGraph = this._fieldConfList
            .map((fieldConf) => {
                return fieldConf.dependencies?.map((dependence) => ({
                    fieldName: fieldConf.fieldName,
                    dependOn: dependence,
                }));
            })
            .filter(Boolean)
            .flat();

        const allBeDependOnFields = Array.from(
            new Set(dependGraph.map((edge) => edge.dependOn))
        );
        const effectMap = new Map<string, string[]>();

        function loop(sourceFieldName, fieldName) {
            const effectFields = dependGraph
                .filter((edge) => edge.dependOn === fieldName)
                .map((edge) => edge.fieldName);
            if (!effectFields.length) {
                return;
            }
            if (effectMap.has(fieldName)) {
                effectMap.set(
                    fieldName,
                    effectMap.get(fieldName).concat(effectFields)
                );
            } else {
                effectMap.set(fieldName, effectFields);
            }
            if (effectMap.has(sourceFieldName)) {
                effectMap.set(
                    sourceFieldName,
                    effectMap.get(sourceFieldName).concat(effectFields)
                );
            } else {
                effectMap.set(sourceFieldName, effectFields);
            }
            effectFields.forEach((effectField) => loop(fieldName, effectField));
        }

        allBeDependOnFields.forEach((fieldName) => {
            loop(fieldName, fieldName);
        });

        effectMap.forEach((v, k) => {
            const value = Array.from(new Set(v));
            effectMap.set(k, value);
        });

        return effectMap;
    }

    /**
     * 订阅字段间依赖关系的处理
     */
    subscribeFieldChangeEvent = () => {
        const effectMap = this.getFieldsDependGraph();
        effectMap.forEach((effectList, field) => {
            this._pubSubCenter.subscribeFieldDepEvent(
                field,
                fieldValueInteractionFactory.bind(
                    null,
                    this._formInstance,
                    effectList,
                    this._fieldConfList
                )
            );
        });
    };

    /**
     * 订阅 triggerServices
     */
    subscribeTriggerServices = () => {
        this._fieldConfList.forEach((fieldConf) => {
            const { fieldName, triggerServices } = fieldConf;
            if (!triggerServices?.length) return;
            const serviceActions: IServiceEvent[] =
                fieldConf.triggerServices?.map?.((triggerService) => {
                    const service = this._triggerServiceFactory(triggerService);
                    const triggers = triggerService?.triggers?.length
                        ? triggerService?.triggers
                        : [
                              ServiceTriggerEnum.onMount,
                              ServiceTriggerEnum.onChange,
                          ];
                    return {
                        service,
                        triggers,
                        fieldInExtraData: triggerService.fieldInExtraData,
                        serviceName: triggerService.serviceName,
                    };
                });
            this._pubSubCenter.subscribeServiceEvent(fieldName, serviceActions);
        });
    };

    /**
     * 订阅
     */
    subscribe = (fieldList: JsonConfigFieldType[]) => {
        this._fieldConfList = fieldList;
        this.subscribeTriggerServices();
        this.subscribeFieldChangeEvent();
    };
}
