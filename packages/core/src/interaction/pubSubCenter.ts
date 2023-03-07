import { ExtraDataRefType } from "../extraDataContext";

export default class PubSubCenter {
    private _dependenciesEventPool: Map<string, Function[]> = new Map();
    private _triggerEventPool: Map<string, Function[]> = new Map();
    private _immediateTriggerEventPool: Map<String, Function[]> = new Map();

    subscribeDepEvent = (field: string, effectHandler: Function | Function[]) =>  {
        const effectHandlers = Array.isArray(effectHandler) ?  effectHandler : [effectHandler];

        if (this._dependenciesEventPool.has(field)) {
            this._dependenciesEventPool.set(
                field, 
                [...this._dependenciesEventPool.get(field), ...effectHandlers]
            )
        } else {
            this._dependenciesEventPool.set(field, effectHandlers)
        }
    }

    publishDepEvent = (field: string) =>  {
        const effectHandler = this._dependenciesEventPool.get(field) ?? []
        effectHandler.forEach(handler => handler.call(null))
    }

    subscribeTriggerEvent (field: string, _service: Function | Function[]) {
        const services = Array.isArray(_service) ?  _service : [_service];

        if (this._triggerEventPool.has(field)) {
            this._triggerEventPool.set(
                field, 
                [...this._triggerEventPool.get(field), ...services]
            )
        } else {
            this._triggerEventPool.set(field, services)
        }
    }
    
    publishTriggerEvent (field: string, formData: any, extraDataRef: ExtraDataRefType) {
        const services = this._triggerEventPool.get(field) ?? []
        services.forEach(service => service.call(null, formData, extraDataRef.current))
    }

    subscribeImmediateTriggerEvent (field: string, _service: Function | Function[]) {
        const services = Array.isArray(_service) ?  _service : [_service];

        if (this._immediateTriggerEventPool.has(field)) {
            this._immediateTriggerEventPool.set(
                field, 
                [...this._immediateTriggerEventPool.get(field), ...services]
            )
        } else {
            this._immediateTriggerEventPool.set(field, services)
        }
    }
    
    publishImmediateTriggerEvent (field, formData, extraDataRef: ExtraDataRefType) {
        const services = this._immediateTriggerEventPool.get(field) ?? []
        services.forEach(service => service.call(null, formData, extraDataRef.current))
    }

    dispose() {
        this._dependenciesEventPool.clear();
        this._immediateTriggerEventPool.clear();
        this._triggerEventPool.clear();
    }
}