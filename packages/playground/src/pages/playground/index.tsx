import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'antd';
import WorkBench from './workbench/workbench';
import HeaderBar from './headerBar';
import { localDB, LocalDBKey, DefaultWip } from '@/utils/localDb';
import './playground.less';

{
    /* <Alert
message="demo 已经内置了 hive 和 oracle 两种数据源作为来源时的配置，选择数据源，左侧编辑器就会自动出现对应的配置，编辑配置，并点击 refresh 按钮，表单会根据编辑器内容重新渲染！"
type="info"
showIcon
/> */
}

interface ContextValueType {
    [LocalDBKey.AutoSave]?: boolean;
    [LocalDBKey.WIP]?: string;
    [LocalDBKey.WorkBench]?: any[];
}

const initialContext: ContextValueType = {
    [LocalDBKey.AutoSave]: false,
    [LocalDBKey.WIP]: DefaultWip,
    [LocalDBKey.WorkBench]: [],
};

type UpdateContextType = (context: ContextValueType) => any;

type PlaygroundContextType = ContextValueType & {
    updateContext: UpdateContextType;
};

export const PlaygroundContext = React.createContext<PlaygroundContextType>(
    initialContext as any,
);

const Playground: React.FC = () => {
    const [contextValue, setContext] =
        useState<ContextValueType>(initialContext);

    const updateContext = useCallback(
        (context: ContextValueType) => {
            setContext({ ...contextValue, ...context });
            if (context[LocalDBKey.AutoSave] !== undefined) {
                localDB.set(LocalDBKey.AutoSave, context[LocalDBKey.AutoSave]);
            }
            if (context[LocalDBKey.WIP] !== undefined) {
                localDB.set(LocalDBKey.WIP, context[LocalDBKey.WIP]);
            }
            if (context[LocalDBKey.WorkBench] !== undefined) {
                localDB.set(
                    LocalDBKey.WorkBench,
                    context[LocalDBKey.WorkBench],
                );
            }
        },
        [setContext],
    );

    useEffect(() => {
        const context = {
            ...initialContext,
        };
        const autoSave = localDB.get(LocalDBKey.AutoSave);
        const wip = localDB.get(LocalDBKey.WIP);
        const workbench = localDB.get(LocalDBKey.WorkBench);
        if (autoSave === undefined) {
            context[LocalDBKey.AutoSave] = true;
            localDB.set(LocalDBKey.AutoSave, true);
        } else {
            context[LocalDBKey.AutoSave] = autoSave;
        }
        if (wip === undefined) {
            context[LocalDBKey.WIP] = DefaultWip;
            localDB.set(LocalDBKey.WIP, DefaultWip);
        } else {
            context[LocalDBKey.WIP] = wip;
        }
        if (workbench === undefined) {
            context[LocalDBKey.WorkBench] = [];
            localDB.set(LocalDBKey.WorkBench, []);
        } else {
            context[LocalDBKey.WorkBench] = workbench;
        }

        setContext(context);
    }, []);

    return (
        <PlaygroundContext.Provider value={{ ...contextValue, updateContext }}>
            <div className="playground">
                <div className="playground-header">
                    <div className="playground-header-title">Playground</div>
                    <HeaderBar />
                </div>
                <div className="playground-content">
                    <WorkBench />
                </div>
            </div>
        </PlaygroundContext.Provider>
    );
};

export default Playground;
