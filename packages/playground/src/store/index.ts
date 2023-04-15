// index.ts 文件

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { createLogger } from 'redux-logger';
import configure, { initConfigure } from './reducers/configureSlice';
import workbench, { initWorkbench } from './reducers/workbenchSlice';
import { initIDB, syncRedux2IDB, getAllIDBData } from './indexDB';

// configureStore创建一个redux数据
const store = configureStore({
    // 合并多个Slice
    reducer: {
        workbench,
        configure,
    },
    middleware: [createLogger()],
});

initIDB();

/**
 * 订阅redux的变化并更新到 indexDB 中
 */
store.subscribe(() => {
    syncRedux2IDB(store.getState());
});

export function syncIDB2Redux() {
    return getAllIDBData().then((res) => {
        const { workbench, configure } = res;
        store.dispatch(initWorkbench(workbench));
        store.dispatch(initConfigure(configure));
    });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
