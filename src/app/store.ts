import { baseApi } from '@/app/api/baseApi';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { AppStatus, ResultCode } from '@/common/enums/enums';
import { logoutCleanup } from '@/common/utils/commonActions';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import { handleReduxQueryError } from '@/common/utils/handleReduxQueryError';
import { authApi } from '@/features/auth/api/authApi';
import {
    name as auth,
    authSliceReducer,
    setIsLoggedIn,
} from '@/features/auth/model/authSlice';
import {
    todolists,
    todolistsReducer,
} from '@/features/todolists/model/todolistsSlice';
import { configureStore, Middleware, ThunkDispatch } from '@reduxjs/toolkit';
import {
    name as app,
    appSliceReducer,
    appStatusChanged,
    appStatusTextSet,
} from './appSlice';

const authHandlersMiddleware: Middleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        if (authApi.endpoints.logout.matchFulfilled(action)) {
            const res = action.payload;
            if (res.resultCode !== ResultCode.Success) {
                dispatchAppStatusData(
                    dispatch,
                    AppStatus.FAILED,
                    'some error occured',
                );
            } else {
                new Promise<void>((res) => {
                    dispatch(setIsLoggedIn(false));
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    res();
                }).then(() => {
                    dispatch(
                        baseApi.util.invalidateTags(['Todolists', 'Tasks']),
                    );
                    dispatch(appStatusChanged(AppStatus.IDLE));
                });
            }
            return;
        } else if (authApi.endpoints.logout.matchRejected(action)) {
            const { payload } = action;
            if (payload) handleReduxQueryError(dispatch, payload);
        }

        return next(action);
    };

export const store = configureStore({
    reducer: {
        [auth]: authSliceReducer,
        [app]: appSliceReducer,
        [todolists]: todolistsReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            baseApi.middleware,
            authHandlersMiddleware,
        ),
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppActionType =
    | ReturnType<typeof appStatusChanged>
    | ReturnType<typeof appStatusTextSet>
    | ReturnType<typeof logoutCleanup>
    | ReturnType<typeof setIsLoggedIn>
    | ReturnType<typeof baseApi.util.resetApiState>
    | ReturnType<typeof baseApi.util.invalidateTags>;

// typeof store.dispatch returns ThunkDispatch<RootState, undefined, UnknownAction>
// so I will be able to dispatch everything without any type checking
// because of that I'll combine my reducer actions myself
export type AppDispatch = ThunkDispatch<RootState, undefined, AppActionType>;

//@ts-expect-error asd
window.store = store;
