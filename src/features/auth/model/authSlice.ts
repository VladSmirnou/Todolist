import {
    type AppStatus,
    appStatusChanged,
    appStatusTextSet,
} from '@/app/appSlice';
import { instance } from '@/common/instance/instance';
import type { LoginFormData, Respose } from '@/common/types/types';
import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

const initialState = {
    isLoggedIn: false,
};

type MeResponseData = {
    id: number;
    email: string;
    login: string;
};

const dispatchAppStatusData = (
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
    status: AppStatus,
    message: string,
) => {
    dispatch(appStatusChanged(status));
    dispatch(appStatusTextSet(message));
};

const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: (create) => ({
        me: create.asyncThunk(
            async () => {
                const res =
                    await instance.get<Respose<MeResponseData>>('/auth/me');
                return res.data.resultCode === 0;
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
            },
        ),
        login: create.asyncThunk(
            async (data: LoginFormData, { dispatch, rejectWithValue }) => {
                try {
                    const res = await instance.post<
                        Respose<{
                            token: string;
                            userId: number;
                        }>
                    >('/auth/login', data);
                    if (res.data.resultCode !== 0) {
                        if (res.data.fieldsErrors.length) {
                            return rejectWithValue(res.data.fieldsErrors);
                        }
                        const errorMessage = res.data.messages[0];
                        dispatchAppStatusData(dispatch, 'failed', errorMessage);
                        return false;
                    }
                    localStorage.setItem('authToken', res.data.data.token);
                    return true;
                } catch (e) {
                    // AxiosError / Error -> e.message
                    const errorMessage = (e as AxiosError | Error).message;
                    dispatchAppStatusData(dispatch, 'failed', errorMessage);
                    return false;
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
            },
        ),
        logout: create.asyncThunk(
            async (_, { dispatch }) => {
                const userRemainsLoggedIn = true;
                try {
                    const res = await instance.delete<Respose>('/auth/login');
                    if (res.data.resultCode !== 0) {
                        dispatchAppStatusData(
                            dispatch,
                            'failed',
                            'some error occured',
                        );
                        return userRemainsLoggedIn;
                    }
                    localStorage.removeItem('authToken');
                    dispatch(appStatusChanged('succeeded'));
                    return !userRemainsLoggedIn;
                } catch (e) {
                    const errorMessage = (e as AxiosError | Error).message;
                    dispatchAppStatusData(dispatch, 'failed', errorMessage);
                    return userRemainsLoggedIn;
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
            },
        ),
    }),
    selectors: {
        selectIsLoggedIn: (state) => state.isLoggedIn,
    },
});

export const { name, reducer: authSliceReducer } = authSlice;
export const { selectIsLoggedIn } = authSlice.selectors;
export const { me, login, logout } = authSlice.actions;
