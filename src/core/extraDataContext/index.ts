import React, { useRef, useReducer } from "react";

export function useExtraData (init) {
    const stateRef = useRef(init)
    const [_, updateState] = useReducer((preState, action) => {
        stateRef.current = typeof action === 'function'
            ? {...action(preState)}
            : {...action}
        return stateRef.current
    }, init)

    return [stateRef, updateState] as const
}

export type IExtraDataRef = ReturnType<typeof useExtraData>[0]
type IUpdateExtra = ReturnType<typeof useExtraData>[1]

export interface IExtraContext {
    extraDataRef: IExtraDataRef;
    update: IUpdateExtra;
}

const ExtraContext = React.createContext<IExtraContext>({extraDataRef: { current: {} }, update: () => void 0});

export default ExtraContext
