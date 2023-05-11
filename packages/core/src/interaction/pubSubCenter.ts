import { ExtraDataRefType } from '../extraDataContext';
import { FormServiceType, ServiceTriggerKind } from '../type';

export interface IServiceEvent {
    service: FormServiceType;
    triggers: ServiceTriggerKind[];
    fieldInExtraData: string;
    serviceName: string;
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
        const changedFields = effectHandler.map((handler) => handler());
        return changedFields.flat();
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

    batchPublishServiceEvent = (
        fieldNames: string[],
        trigger: ServiceTriggerKind,
        formData: any,
        extraDataRef: ExtraDataRefType,
    ) => {
        const willTrigServiceActions: ({
            fieldName: string;
        } & IServiceEvent)[] = [];
        fieldNames.forEach((fieldName) => {
            const serviceActions = this._serviceEventPool.get(fieldName) ?? [];
            // 过滤掉不需要触发的 service 和 重复的 service
            serviceActions.forEach((serviceAction) => {
                const { fieldInExtraData, triggers, serviceName } =
                    serviceAction;
                if (!triggers.includes(trigger)) return;
                const hasExist = willTrigServiceActions.some((action) => {
                    return (
                        action.serviceName === serviceName &&
                        action.fieldInExtraData === fieldInExtraData
                    );
                });
                if (hasExist) return;
                willTrigServiceActions.push({ ...serviceAction, fieldName });
            });
        }, []);

        willTrigServiceActions.forEach((serviceAction) => {
            const { triggers, service, fieldName } = serviceAction;
            if (triggers.includes(trigger)) {
                service({
                    args: [],
                    trigger,
                    fieldName,
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
