import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { dispatchAppStatusData } from './dispatchAppStatusData';
import type { AppDispatch } from '@/app/store';
import { AppStatus } from '../enums/enums';

export const handleReduxQueryError = (
    dispatch: AppDispatch,
    error: FetchBaseQueryError | SerializedError,
) => {
    let errorMessage;
    if ('status' in error) {
        if (typeof error.status === 'number') {
            errorMessage =
                (error as { status: number; data: { message?: string } }).data
                    ?.message ?? JSON.stringify(error.data);
        } else {
            errorMessage = error.error;
        }
    } else {
        errorMessage = error.message || 'Some error occured';
    }
    dispatchAppStatusData(dispatch, AppStatus.FAILED, errorMessage);
};
