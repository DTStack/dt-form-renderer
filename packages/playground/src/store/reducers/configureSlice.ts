import { createSlice } from '@reduxjs/toolkit';

export interface ConfigureType {
    autoSave: boolean
}

export const initialState: ConfigureType = {
    autoSave: true,
};

// 创建一个 Slice
export const configureSlice = createSlice({
    name: 'configure',
    initialState,
    reducers: {
        initConfigure: (state, action: { payload: ConfigureType }) =>{
            return action.payload;
        },
        setAutoSave: (state, action: { payload: boolean }) => {
            return {
                autoSave: action.payload
            };
        },
    },
});

export const { setAutoSave, initConfigure } = configureSlice.actions;

export default configureSlice.reducer;
