import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';

export type AppStatus = 'idle' | 'failed' | 'succeeded' | 'pending';

const initialState = {
    appStatus: 'idle' as AppStatus,
    appStatusText: '',
};

const appSlise = createAppSlice({
    name: 'app',
    initialState,
    reducers: {
        appStatusChanged: (state, action: PayloadAction<AppStatus>) => {
            state.appStatus = action.payload;
        },
        appStatusTextSet: (state, action: PayloadAction<string>) => {
            state.appStatusText = action.payload;
        },
    },
    selectors: {
        selectAppStatus: (state) => state.appStatus,
        selectAppStatusText: (state) => state.appStatusText,
    },
});

export const { name, reducer: appSliceReducer } = appSlise;
export const { appStatusChanged, appStatusTextSet } = appSlise.actions;
export const { selectAppStatus, selectAppStatusText } = appSlise.selectors;
