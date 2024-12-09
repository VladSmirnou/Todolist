import {
    type AppStatus,
    appStatusChanged,
    appStatusTextSet,
} from '@/app/appSlice';
import type { AppActionType } from '@/app/store';
import { ThunkDispatch } from '@reduxjs/toolkit';

export const dispatchAppStatusData = (
    dispatch: ThunkDispatch<unknown, unknown, AppActionType>,
    status: AppStatus,
    message: string,
) => {
    dispatch(appStatusChanged(status));
    dispatch(appStatusTextSet(message));
};
