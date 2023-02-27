import { FormInstance } from "antd";
import PubSubCenter from "./pubSubCenter"
import { fieldValueInteractionFactory, triggerServiceFactory } from './factory'
import { FormServicePool } from "../components/support-type";
import { IExtraContext } from '../extraDataContext'

export default class InteractionSubscriber {
    private _parsedJson: any[] = null
    private _pubSubCenter: PubSubCenter = null;
    private _formInstance: FormInstance = null;
    private _extraContext: IExtraContext = null;
    private _triggerServiceFactory: ( action: any ) => any = null;

    constructor(formInstance: FormInstance, pubSubCenter: PubSubCenter, extraContext: IExtraContext, formServicePool: FormServicePool) {
        this._formInstance = formInstance;
        this._extraContext = extraContext;
        this._pubSubCenter = pubSubCenter
        this._triggerServiceFactory = triggerServiceFactory.bind(null, formServicePool, extraContext.update)
    }

    dispose () {
        this._parsedJson = null;
        this._formInstance = null;
        this._extraContext = null;
        this._pubSubCenter.dispose();
        this._triggerServiceFactory = null
    }

    /**
     * 获取一个字段的变化会影响哪些字段 包括直接和间接影响
     * 生成对应的依赖图
     */
    private getFieldsDependGraph () {
        /** 
         * TODO 需要检测依赖是否成环 
         */
        const dependGraph = this._parsedJson.map(fieldConf => {
            return fieldConf.dependencies?.map(( dependence => ({ fieldName: fieldConf.fieldName, dependOn: dependence  }) ))
        }).filter(Boolean).flat()

        const allBeDependOnFields = Array.from(new Set(dependGraph.map((edge) => edge.dependOn)))
        const effectMap = new Map<string, string[]>();

        function loop (sourceFieldName, fieldName) {
            const effectFields = dependGraph
                .filter(edge => edge.dependOn === fieldName)
                .map(edge => edge.fieldName)
            if(!effectFields.length) {
                return 
            }
            if(effectMap.has(fieldName)) {
                effectMap.set(fieldName, effectMap.get(fieldName).concat(effectFields))
            } else {
                effectMap.set(fieldName, effectFields)
            }
            if(effectMap.has(sourceFieldName)) {
                effectMap.set(sourceFieldName, effectMap.get(sourceFieldName).concat(effectFields))
            } else {
                effectMap.set(sourceFieldName, effectFields)
            }
            effectFields.forEach(effectField =>  loop(fieldName, effectField))
        }

        allBeDependOnFields.forEach(fieldName => {
            loop(fieldName, fieldName)
        })

        effectMap.forEach((v, k) => {
            const value = Array.from(new Set(v))
            effectMap.set(k, value)
        })

        return effectMap
    }

    /**
     * 订阅字段间依赖关系的处理
     */
    subscribeFieldChangeEvent = () => {
        const effectMap = this.getFieldsDependGraph();
        effectMap.forEach((effectList, field) => {
            this._pubSubCenter.subscribeDepEvent(field, 
                fieldValueInteractionFactory.bind(null, this._formInstance, effectList)
            )
        })
    }

    /**
     * 订阅 triggerAction
     */
    subscribeTriggerActions = () => {
        this._parsedJson.forEach((fieldConf) => {
            fieldConf.triggerActions?.forEach?.(action => {
                const service = this._triggerServiceFactory(action)
                if(action.immediate === true) {
                    this._pubSubCenter.subscribeImmediateTriggerEvent(fieldConf.fieldName, service)
                } else if (action.immediate === false) {
                    this._pubSubCenter.subscribeTriggerEvent(fieldConf.fieldName, service)
                } else {
                    this._pubSubCenter.subscribeTriggerEvent(fieldConf.fieldName, service)
                    this._pubSubCenter.subscribeImmediateTriggerEvent(fieldConf.fieldName, service)
                }
            })
        })
    }
    
    /**
     * 订阅
     */
    subscribe = (parsedJson: any[]) => {
        this._parsedJson = parsedJson
        this.subscribeFieldChangeEvent();
        this.subscribeTriggerActions();
    }
}


