import type { LoginFormData } from '@/common/types/types';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth-api';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import { appStatusChanged } from '@/app/appSlice';
import { AppStatus, ResultCode } from '@/common/enums/enums';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';

const initialState = {
    isLoggedIn: false,
};

const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: (create) => ({
        me: create.asyncThunk(
            async () => {
                const res = await authApi.me();
                return res.data.resultCode === ResultCode.Success;
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
                    dispatch(appStatusChanged(AppStatus.PENDING));
                    const res = await authApi.login(data);
                    if (res.data.resultCode !== ResultCode.Success) {
                        if (res.data.fieldsErrors.length) {
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
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
            },
        ),
        logout: create.asyncThunk(
            async (_, { dispatch }) => {
                dispatch(appStatusChanged(AppStatus.PENDING));
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
                    dispatchAppStatusData(
                        dispatch,
                        AppStatus.FAILED,
                        errorMessage,
                    );
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
