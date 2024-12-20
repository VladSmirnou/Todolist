import { AppStatus } from '@/common/enums/enums';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    appStatus: AppStatus.IDLE,
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
