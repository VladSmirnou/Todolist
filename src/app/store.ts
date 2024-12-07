import {
    name as auth,
    authSliceReducer,
} from '@/features/auth/model/authSlice';
import {
    removeLocalOldestTaskForTodolist,
    removeLocalTask,
    removeLocalTasks,
    tasksReducer,
} from '@/features/todolists/model/tasksSlice';
import {
    paginationPageChanged,
    serverTaskCountIncremented,
    setTasksCount,
    todolistsReducer,
} from '@/features/todolists/model/todolistSlice';
import {
    combineReducers,
    configureStore,
    ThunkDispatch,
} from '@reduxjs/toolkit';
import {
    name as app,
    appSliceReducer,
    appStatusChanged,
    appStatusTextSet,
} from './appSlice';

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
    | ReturnType<typeof removeLocalOldestTaskForTodolist>
    | ReturnType<typeof setTasksCount>
    | ReturnType<typeof paginationPageChanged>
    | ReturnType<typeof serverTaskCountIncremented>;

// typeof store.dispatch returns ThunkDispatch<RootState, undefined, UnknownAction>
// so I will be able to dispatch everything without any type checking
// because of that I'll combine my reducer actions myself
export type AppDispatch = ThunkDispatch<RootState, undefined, AppActionType>;

//@ts-expect-error asd
window.store = store;
