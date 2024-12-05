import {
    combineReducers,
    configureStore,
    ThunkDispatch,
} from '@reduxjs/toolkit';
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
import {
    removeLocalTask,
    removeLocalOldestTaskForTodolist,
    removeLocalTasks,
    tasksReducer,
} from '@/features/todolists/model/tasksSlice';
import { todolistsReducer } from '@/features/todolists/model/todolistSlice';

const todolistEntitiesReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
});

export const store = configureStore({
    reducer: {
        [auth]: authSliceReducer,
        [app]: appSliceReducer,
        todolistEntities: todolistEntitiesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

type AppActionType =
    | ReturnType<typeof appStatusChanged>
    | ReturnType<typeof appStatusTextSet>
    | ReturnType<typeof removeLocalTask>
    | ReturnType<typeof removeLocalTasks>
    | ReturnType<typeof removeLocalOldestTaskForTodolist>;
// typeof store.dispatch returns ThunkDispatch<RootState, undefined, UnknownAction>
// so I will be able to dispatch everything without any type checking
// because of that I'll combine my reducer actions myself
export type AppDispatch = ThunkDispatch<RootState, undefined, AppActionType>;

//@ts-expect-error asd
window.store = store;
