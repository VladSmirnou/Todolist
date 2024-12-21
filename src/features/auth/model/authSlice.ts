import type { LoginFormData } from '@/common/types/types';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth-api';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import { appStatusChanged } from '@/app/appSlice';
import { AppStatus, ResultCode } from '@/common/enums/enums';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { AppStartListening } from '@/app/listenerMiddleware';
import { isAnyOf } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
};

const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: (create) => ({
        me: create.asyncThunk<boolean, void>(async () => {
            const res = await authApi.me();
            return res.data.resultCode === ResultCode.Success;
        }),
        login: create.asyncThunk<boolean, LoginFormData>(
            async (data, { dispatch, rejectWithValue }) => {
                try {
                    const res = await authApi.login(data);
                    if (res.data.resultCode !== ResultCode.Success) {
                        if (res.data.fieldsErrors.length) {
                            dispatch(appStatusChanged(AppStatus.IDLE));
                            return rejectWithValue(res.data.fieldsErrors);
                        }
                        const errorMessage = res.data.messages[0];
                        dispatchAppStatusData(
                            dispatch,
                            AppStatus.FAILED,
                            errorMessage,
                        );
                        return false;
                    }
                    localStorage.setItem(AUTH_TOKEN_KEY, res.data.data.token);
                    dispatch(appStatusChanged(AppStatus.IDLE));
                    return true;
                } catch (e) {
                    // AxiosError / Error -> e.message
                    const errorMessage = (e as AxiosError | Error).message;
                    dispatchAppStatusData(
                        dispatch,
                        AppStatus.FAILED,
                        errorMessage,
                    );
                    return false;
                }
            },
        ),
        logout: create.asyncThunk<boolean, void>(async (_, { dispatch }) => {
            const userRemainsLoggedIn = true;
            try {
                const res = await authApi.logout();
                if (res.data.resultCode !== ResultCode.Success) {
                    dispatchAppStatusData(
                        dispatch,
                        AppStatus.FAILED,
                        'some error occured',
                    );
                    return userRemainsLoggedIn;
                }
                dispatch(appStatusChanged(AppStatus.IDLE));
                localStorage.removeItem(AUTH_TOKEN_KEY);
                return !userRemainsLoggedIn;
            } catch (e) {
                const errorMessage = (e as AxiosError | Error).message;
                dispatchAppStatusData(dispatch, AppStatus.FAILED, errorMessage);
                return userRemainsLoggedIn;
            }
        }),
    }),
    selectors: {
        selectIsLoggedIn: (state) => state.isLoggedIn,
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(me.fulfilled, login.fulfilled, logout.fulfilled),
            (state, action) => {
                state.isLoggedIn = action.payload;
            },
        );
    },
});

export const { name, reducer: authSliceReducer } = authSlice;
export const { selectIsLoggedIn } = authSlice.selectors;
export const { me, login, logout } = authSlice.actions;

export const addAuthListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        matcher: isAnyOf(login.pending, logout.pending),
        effect: (_, { dispatch }) => {
            dispatch(appStatusChanged(AppStatus.PENDING));
        },
    });
};
