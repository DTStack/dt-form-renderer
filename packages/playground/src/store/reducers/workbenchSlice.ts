import { createSlice } from '@reduxjs/toolkit';
export const DefaultWip = 'untitled';

export interface FileMetaType {
    name: string;
    configContent: string;
    gmtModified?: number;
    valuesContent: string;
}

export interface WorkbenchType {
    workInProgress: string;
    files: FileMetaType[];
}
export const initialState: WorkbenchType = {
    workInProgress: DefaultWip,
    files: [
        {
            name: DefaultWip,
            configContent: '',
            valuesContent: '',
            gmtModified: Date.now(),
        },
    ],
};

// 创建一个 Slice
export const workbenchSlice = createSlice({
    name: 'workbench',
    initialState: {
        ...initialState,
        workInProgress: undefined, // wip 不设置默认值
    },
    reducers: {
        initWorkbench: (state, action: { payload: WorkbenchType }) => {
            return action.payload;
        },
        setWIP: (state, action: { payload: string }) => {
            return {
                ...state,
                workInProgress: action.payload,
            };
        },
        updateFile: (
            state,
            action: {
                payload: { fileName: string; fileMeta: Partial<FileMetaType> };
            }
        ) => {
            const { fileName, fileMeta } = action.payload;
            const index = state.files.findIndex(
                (file) => file.name === fileName
            );
            const newFiles = [...state.files];
            newFiles[index] = {
                ...newFiles[index],
                ...fileMeta,
                gmtModified: Date.now(),
            };
            return {
                ...state,
                files: newFiles,
            };
        },
        createFile: (state) => {
            const newFiles = [...state.files];
            newFiles.unshift({
                name: DefaultWip,
                configContent: '',
                valuesContent: '',
                gmtModified: Date.now(),
            });
            return {
                ...state,
                files: newFiles,
            };
        },
        removeFile: (state, action: { payload: string }) => {
            const newFiles = state.files.filter(
                (file) => file.name !== action.payload
            );
            return {
                ...state,
                files: newFiles,
            };
        },
    },
});

export const { setWIP, updateFile, createFile, removeFile, initWorkbench } =
    workbenchSlice.actions;

export default workbenchSlice.reducer;
