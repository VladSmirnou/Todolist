import { AxiosError } from 'axios';
import { dispatchAppStatusData } from './dispatchAppStatusData';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { AppStatus } from '../enums/enums';

export const clientErrorHandler = (
    e: unknown,
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
) => {
    const errorMessage = (e as AxiosError | Error).message;
    dispatchAppStatusData(dispatch, AppStatus.FAILED, errorMessage);
    return errorMessage;
};
