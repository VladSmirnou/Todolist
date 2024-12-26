import { AppStatus } from '@/common/enums/enums';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { tasksApi } from '@/features/api/tasksApi';
import { todolistsApi } from '@/features/api/todolistsApi';
import {
    isAnyOf,
    isFulfilled,
    isPending,
    PayloadAction,
} from '@reduxjs/toolkit';

const initialState = {
    appStatus: AppStatus.IDLE,
    appStatusText: '',
};

const appSlise = createAppSlice({
    name: 'app',
    initialState,
    reducers: {
        appStatusChanged: (state, action: PayloadAction<AppStatus>) => {
            state.appStatus = action.payload;
        },
        appStatusTextSet: (state, action: PayloadAction<string>) => {
            state.appStatusText = action.payload;
        },
    },
    selectors: {
        selectAppStatus: (state) => state.appStatus,
        selectAppStatusText: (state) => state.appStatusText,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending, (state, action) => {
                const predicate = isAnyOf(
                    todolistsApi.endpoints.fetchTodolists.matchPending,
                    todolistsApi.endpoints.removeTodolist.matchPending,
                    todolistsApi.endpoints.updateTodolist.matchPending,
                    tasksApi.endpoints.fetchTasks.matchPending,
                    tasksApi.endpoints.removeTask.matchPending,
                )(action);

                if (!predicate) {
                    state.appStatus = AppStatus.PENDING;
                }
            })
            .addMatcher(isFulfilled, (state, action) => {
                if (todolistsApi.endpoints.addTodolist.matchFulfilled(action)) {
                    state.appStatus = AppStatus.SUCCEEDED;
                    state.appStatusText = 'Todolist was successfully added';
                    return;
                }

                if (tasksApi.endpoints.addTask.matchFulfilled(action)) {
                    state.appStatus = AppStatus.SUCCEEDED;
                    state.appStatusText = 'Task was successfully added';
                    return;
                }

                const predicate = isAnyOf(
                    tasksApi.endpoints.addTask.matchFulfilled,
                    tasksApi.endpoints.removeTask.matchFulfilled,
                    tasksApi.endpoints.fetchTasks.matchFulfilled,

                    todolistsApi.endpoints.fetchTodolists.matchFulfilled,
                    todolistsApi.endpoints.addTodolist.matchFulfilled,
                    todolistsApi.endpoints.updateTodolist.matchFulfilled,
                )(action);

                if (!predicate) {
                    state.appStatus = AppStatus.IDLE;
                }
            });
    },
});

export const { name, reducer: appSliceReducer } = appSlise;
export const { appStatusChanged, appStatusTextSet } = appSlise.actions;
export const { selectAppStatus, selectAppStatusText } = appSlise.selectors;
