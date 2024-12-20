import { appStatusChanged, appStatusTextSet } from '@/app/appSlice';
import type { AppActionType } from '@/app/store';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AppStatus } from '../enums/enums';

export const dispatchAppStatusData = (
    dispatch: ThunkDispatch<unknown, unknown, AppActionType>,
    status: AppStatus,
    message: string,
) => {
    dispatch(appStatusChanged(status));
    dispatch(appStatusTextSet(message));
};
