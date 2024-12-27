import { AppStatus, ResultCode } from '@/common/enums/enums';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { tasksApi } from '@/features/todolists/api/tasksApi';
import { todolistsApi } from '@/features/todolists/api/todolistsApi';
import {
    isAnyOf,
    isFulfilled,
    isPending,
    isRejected,
    PayloadAction,
} from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const initialState = {
    appStatus: AppStatus.IDLE,
    appStatusText: '',
};

const getErrorMessage = (error: FetchBaseQueryError | undefined) => {
    let errorMessage;
    if (error) {
        if (typeof error.status === 'number') {
            errorMessage =
                (
                    error as {
                        status: number;
                        data: { message?: string };
                    }
                ).data?.message ?? JSON.stringify(error.data);
        } else {
            errorMessage = error.error;
        }
    } else {
        errorMessage = 'Some error occured';
    }
    return errorMessage;
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
            .addMatcher(isRejected, (state, action) => {
                const todolistsPredicate = isAnyOf(
                    todolistsApi.endpoints.fetchTodolists.matchRejected,
                    todolistsApi.endpoints.addTodolist.matchRejected,
                    todolistsApi.endpoints.updateTodolist.matchRejected,
                    todolistsApi.endpoints.removeTodolist.matchRejected,
                )(action);
                if (todolistsPredicate) {
                    const { payload } = action;
                    if (payload) {
                        const { payload: error } = action;
                        const errorMessage = getErrorMessage(error);
                        state.appStatus = AppStatus.FAILED;
                        state.appStatusText = errorMessage;
                    }
                }

                const tasksPredicate = isAnyOf(
                    tasksApi.endpoints.fetchTasks.matchRejected,
                    tasksApi.endpoints.addTask.matchRejected,
                    tasksApi.endpoints.updateTask.matchRejected,
                    tasksApi.endpoints.removeTask.matchRejected,
                )(action);
                if (tasksPredicate) {
                    const { payload } = action;
                    if (payload) {
                        const { payload: error } = action;
                        const errorMessage = getErrorMessage(error);
                        state.appStatus = AppStatus.FAILED;
                        state.appStatusText = errorMessage;
                    }
                }
            })
            .addMatcher(isFulfilled, (state, action) => {
                const todolistsPredicate = isAnyOf(
                    todolistsApi.endpoints.updateTodolist.matchFulfilled,
                    todolistsApi.endpoints.removeTodolist.matchFulfilled,
                    todolistsApi.endpoints.addTodolist.matchFulfilled,
                )(action);

                if (todolistsPredicate) {
                    const result = action.payload;
                    if (result.resultCode !== ResultCode.Success) {
                        const errorMessage = result.messages[0];
                        state.appStatus = AppStatus.FAILED;
                        state.appStatusText = errorMessage;
                        return;
                    }
                    if (
                        todolistsApi.endpoints.addTodolist.matchFulfilled(
                            action,
                        )
                    ) {
                        state.appStatus = AppStatus.SUCCEEDED;
                        state.appStatusText = 'Todolist was successfully added';
                        return;
                    }
                    if (
                        !todolistsApi.endpoints.removeTodolist.matchFulfilled(
                            action,
                        )
                    ) {
                        state.appStatus = AppStatus.IDLE;
                    }
                    return;
                }

                const tasksPredicate = isAnyOf(
                    tasksApi.endpoints.addTask.matchFulfilled,
                    tasksApi.endpoints.updateTask.matchFulfilled,
                    tasksApi.endpoints.removeTask.matchFulfilled,
                )(action);

                if (tasksPredicate) {
                    const result = action.payload;
                    if (result.resultCode !== ResultCode.Success) {
                        const errorMessage = result.messages[0];
                        state.appStatus = AppStatus.FAILED;
                        state.appStatusText = errorMessage;
                        return;
                    }
                    if (tasksApi.endpoints.addTask.matchFulfilled(action)) {
                        state.appStatus = AppStatus.SUCCEEDED;
                        state.appStatusText = 'Task was successfully added';
                        return;
                    }
                    if (!tasksApi.endpoints.removeTask.matchFulfilled(action)) {
                        state.appStatus = AppStatus.IDLE;
                    }
                    return;
                }

                const predicate1 = isAnyOf(
                    tasksApi.endpoints.fetchTasks.matchFulfilled,
                    todolistsApi.endpoints.fetchTodolists.matchFulfilled,
                )(action);

                if (!predicate1) {
                    state.appStatus = AppStatus.IDLE;
                }
            });
    },
});

export const { name, reducer: appSliceReducer } = appSlise;
export const { appStatusChanged, appStatusTextSet } = appSlise.actions;
export const { selectAppStatus, selectAppStatusText } = appSlise.selectors;
