import React, { useRef, useReducer } from 'react';

/**
 * @description extraData context hook
 * @param init 缺省值
 * @returns 
 */
export function useExtraData(init) {
    const stateRef = useRef(init);
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


type UpdateExtraType = ReturnType<typeof useExtraData>[1];

export interface ExtraContextType {
    extraDataRef: ExtraDataRefType;
    update: UpdateExtraType;
}

const ExtraContext = React.createContext<ExtraContextType>({
    extraDataRef: { current: {} },
    update: () => void 0,
});

export default ExtraContext;
