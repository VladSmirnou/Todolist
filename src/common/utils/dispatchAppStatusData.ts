import {
    type AppStatus,
    appStatusChanged,
    appStatusTextSet,
} from '@/app/appSlice';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export const dispatchAppStatusData = (
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
    status: AppStatus,
    message: string,
) => {
    dispatch(appStatusChanged(status));
    dispatch(appStatusTextSet(message));
};
