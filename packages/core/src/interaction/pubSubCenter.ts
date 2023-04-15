import { ExtraDataRefType } from '../extraDataContext';
import {
    FormServiceType,
    ServiceTriggerKind
} from '../type';

export interface IServiceEvent {
    service: FormServiceType;
    triggers: ServiceTriggerKind[];
}

export default class PubSubCenter {
    private _fieldDependEventPool: Map<string, Function[]> = new Map();
    private _serviceEventPool: Map<string, IServiceEvent[]> = new Map();

    subscribeFieldDepEvent = (
        field: string,
        effectHandler: Function | Function[],
    ) => {
        const effectHandlers = Array.isArray(effectHandler)
            ? effectHandler
            : [effectHandler];

        if (this._fieldDependEventPool.has(field)) {
            this._fieldDependEventPool.set(field, [
                ...this._fieldDependEventPool.get(field),
                ...effectHandlers,
            ]);
        } else {
            this._fieldDependEventPool.set(field, effectHandlers);
        }
    };

    publishDepEvent = (field: string) => {
        const effectHandler = this._fieldDependEventPool.get(field) ?? [];
        effectHandler.forEach((handler) => handler());
    };

    subscribeServiceEvent = (
        field: string,
        serviceAction: IServiceEvent | IServiceEvent[],
    ) => {
        const services = Array.isArray(serviceAction)
            ? serviceAction
            : [serviceAction];
        if (this._serviceEventPool.has(field)) {
            this._serviceEventPool.set(field, [
                ...this._serviceEventPool.get(field),
                ...services,
            ]);
        } else {
            this._serviceEventPool.set(field, services);
        }
    };

    publishServiceEvent = (
        field: string,
        trigger: ServiceTriggerKind,
        formData: any,
        extraDataRef: ExtraDataRefType,
        restArgs?: any[],
    ) => {
        const serviceActions = this._serviceEventPool.get(field) ?? [];
        serviceActions.forEach((serviceAction) => {
            const { triggers, service } = serviceAction;
            if (triggers.includes(trigger)) {
                service({
                    args: restArgs,
                    trigger,
                    fieldName: field,
                    formData,
                    extraData: extraDataRef.current,
                });
            }
        });
    };

    dispose() {
        this._fieldDependEventPool.clear();
        this._serviceEventPool.clear();
    }
}
