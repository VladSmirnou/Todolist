import type { LoginFormData } from '@/common/types/types';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth-api';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import { appStatusChanged } from '@/app/appSlice';

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
                    dispatch(appStatusChanged('pending'));
                    const res = await authApi.login(data);
                    if (res.data.resultCode !== 0) {
                        if (res.data.fieldsErrors.length) {
                            return rejectWithValue(res.data.fieldsErrors);
                        }
                        const errorMessage = res.data.messages[0];
                        dispatchAppStatusData(dispatch, 'failed', errorMessage);
                        return false;
                    }
                    localStorage.setItem('authToken', res.data.data.token);
                    dispatch(appStatusChanged('idle'));
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
                dispatch(appStatusChanged('pending'));
                const userRemainsLoggedIn = true;
                try {
                    const res = await authApi.logout();
                    if (res.data.resultCode !== 0) {
                        dispatchAppStatusData(
                            dispatch,
                            'failed',
                            'some error occured',
                        );
                        return userRemainsLoggedIn;
                    }
                    dispatch(appStatusChanged('idle'));
                    localStorage.removeItem('authToken');
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
