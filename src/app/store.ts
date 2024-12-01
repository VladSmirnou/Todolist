import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import {
    authSliceReducer,
    name as auth,
} from '@/features/auth/model/authSlice';
import {
    appSliceReducer,
    name as app,
    appStatusChanged,
    appStatusTextSet,
} from './appSlice';

export const store = configureStore({
    reducer: {
        [auth]: authSliceReducer,
        [app]: appSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

type AppActionType =
    | ReturnType<typeof appStatusChanged>
    | ReturnType<typeof appStatusTextSet>;

// typeof store.dispatch returns ThunkDispatch<RootState, undefined, UnknownAction>
// so I will be able to dispatch everything without any type checking
// because of that I'll combine my reducer actions myself
export type AppDispatch = ThunkDispatch<RootState, undefined, AppActionType>;
