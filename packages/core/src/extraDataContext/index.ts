import React, { useRef, useReducer } from 'react';

export interface IExtraDataType {
    serviceLoading: {
        [key: string]: boolean;
    };
    [key: string]: any;
}

/**
 * @description extraData context hook
 * @param init 缺省值
 * @returns
 */
export function useExtraData(init: IExtraDataType) {
    const stateRef = useRef<IExtraDataType>(init);
    const [_, updateState] = useReducer((preState, action) => {
        stateRef.current =
            typeof action === 'function'
                ? { ...action(preState) }
                : { ...action };
        return stateRef.current;
    }, init);

    return [stateRef, updateState] as const;
}

export type ExtraDataRefType = ReturnType<typeof useExtraData>[0];

type ExtraActionType =
    | IExtraDataType
    | ((prevExtraData: IExtraDataType) => IExtraDataType);

export type UpdateExtraType = (action: ExtraActionType) => void;

export interface ExtraContextType {
    extraDataRef: ExtraDataRefType;
    update: UpdateExtraType;
}

const ExtraContext = React.createContext<ExtraContextType>({
    extraDataRef: { current: { serviceLoading: {} } },
    update: () => void 0,
});

export default ExtraContext;
