import {
    name as auth,
    authSliceReducer,
    setIsLoggedIn,
} from '@/features/auth/model/authSlice';
// import {
//     removeLocalOldestTaskForTodolist,
//     removeLocalTask,
//     removeLocalTasks,
//     tasksReducer,
//     tasksStatusChanged,
// } from '@/features/todolists/model/tasksSlice';
import { logoutCleanup } from '@/common/utils/commonActions';
import { baseApi } from '@/features/api/baseApi';
import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import {
    name as app,
    appSliceReducer,
    appStatusChanged,
    appStatusTextSet,
} from './appSlice';
import { listenerMiddleware } from './listenerMiddleware';
import {
    todolists,
    todolistsReducer,
} from '@/features/todolists/model/todolistsSlice';

export const store = configureStore({
    reducer: {
        [auth]: authSliceReducer,
        [app]: appSliceReducer,
        [todolists]: todolistsReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(listenerMiddleware.middleware)
            .concat(baseApi.middleware),
});

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
