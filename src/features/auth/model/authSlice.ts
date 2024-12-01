import { instance } from '@/common/instance/instance';
import { LoginFormData, Respose } from '@/common/types/types';
import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';

const initialState = {
    isLoggedIn: false,
};

type MeResponseData = {
    id: number;
    email: string;
    login: string;
};

const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: (create) => ({
        me: create.asyncThunk(
            async () => {
                const res =
                    await instance.get<Respose<MeResponseData>>('/auth/me');
                if (res.data.resultCode !== 0) {
                    const errorMessage = res.data.messages[0];
                    // dispatch error message
                    return false;
                }
                return true;
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
                rejected: (state, action) => {},
            },
        ),
        login: create.asyncThunk(
            async (data: LoginFormData) => {
                const res = await instance.post<
                    Respose<{
                        token: string;
                        userId: number;
                    }>
                >('/auth/login', data);
                if (res.data.resultCode !== 0) {
                    const errorMessage = res.data.messages[0];
                    // dispatch error message
                    return false;
                }
                localStorage.setItem('authToken', res.data.data.token);
                return true;
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
                rejected: (state, action) => {},
            },
        ),
        logout: create.asyncThunk(
            async () => {
                const res = await instance.delete<Respose>('/auth/login');
                if (res.data.resultCode !== 0) {
                    return true;
                }
                localStorage.removeItem('authToken');
                return false;
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload;
                },
                rejected: (state, action) => {},
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
