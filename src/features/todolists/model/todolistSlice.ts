import { RootState } from '@/app/store';
import { TodolistsStatus } from '@/common/enums/enums';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { todolistsApi } from '../api/todolistsApi';
import { INITIAL_PAGE } from '../utils/constants/constants';
import type { Todolist } from '../utils/types/todolist.types';
import { logoutCleanup } from '@/common/utils/commonActions';

const todolistsAdapter = createEntityAdapter<Todolist>({
    sortComparer: (a, b) => b.addedDate.localeCompare(a.addedDate),
});

const todolistsSlice = createAppSlice({
    name: 'todolists',
    initialState: todolistsAdapter.getInitialState({
        todolistsStatus: TodolistsStatus.INITIAL_LOADING,
        tasksCountForTodolistOnServer: {} as { [key: string]: number },
        paginationPageForTodolist: {} as { [key: string]: number },
    }),
    reducers: (create) => ({
        fetchTodolists: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                try {
                    const res = await todolistsApi.fetchTodolists();
                    return res.data;
                } catch (e) {
                    const errorMessage = (e as AxiosError | Error).message;
                    return rejectWithValue(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.todolistsStatus = TodolistsStatus.SUCCESS;
                    action.payload.forEach(({ id }) => {
                        state.paginationPageForTodolist[id] = INITIAL_PAGE;
                    });
                    todolistsAdapter.setAll(state, action);
                },
                rejected: (state) => {
                    state.todolistsStatus = TodolistsStatus.FAILURE;
                },
            },
        ),
        addTodolist: create.asyncThunk(
            async (todolistTitle: string, { dispatch }) => {
                try {
                    const res = await todolistsApi.addTodolist(todolistTitle);
                    serverErrorHandler(res.data);
                    return res.data.data.item;
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            {
                pending: (state) => {
                    state.todolistsStatus = TodolistsStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    const { id } = action.payload;
                    state.todolistsStatus = TodolistsStatus.SUCCESS;
                    state.paginationPageForTodolist[id] = INITIAL_PAGE;
                    state.tasksCountForTodolistOnServer[id] = 0;
                    todolistsAdapter.addOne(state, action);
                },
                rejected: (state) => {
                    state.todolistsStatus = TodolistsStatus.FAILURE;
                },
            },
        ),
        removeTodolist: create.asyncThunk<string, string>(
            // почему-то здесь он затребовал типизировать
            // параметры в type параметрах, а сверху все нормально
            async (todolistId, { dispatch }) => {
                try {
                    const res = await todolistsApi.removeTodolist(todolistId);
                    serverErrorHandler(res.data);
                    return todolistId;
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    const todolistId = action.payload;
                    delete state.tasksCountForTodolistOnServer[todolistId];
                    delete state.paginationPageForTodolist[todolistId];
                    todolistsAdapter.removeOne(state, action);
                },
            },
        ),
        updateTodolist: create.asyncThunk<
            { id: string; changes: { title: string } },
            { todolistId: string; title: string }
        >(
            async (args, { dispatch }) => {
                const { todolistId, title } = args;
                try {
                    const res = await todolistsApi.changeTodolist(args);
                    serverErrorHandler(res.data);
                    return { id: todolistId, changes: { title } };
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            { fulfilled: todolistsAdapter.updateOne },
        ),
        setTasksCount: create.reducer<{
            todolistId: string;
            tasksCount: number;
        }>((state, action) => {
            const { todolistId, tasksCount } = action.payload;
            state.tasksCountForTodolistOnServer[todolistId] = tasksCount;
        }),
        paginationPageChanged: create.reducer<{
            todolistId: string;
            nextPage: number;
        }>((state, action) => {
            const { todolistId, nextPage } = action.payload;
            state.paginationPageForTodolist[todolistId] = nextPage;
        }),
    }),
    extraReducers: (builder) => {
        builder.addCase(logoutCleanup.type, (state) => {
            state.todolistsStatus = TodolistsStatus.INITIAL_LOADING;
            state.tasksCountForTodolistOnServer = {};
            state.paginationPageForTodolist = {};
            todolistsAdapter.removeAll(state);
        });
    },
    selectors: {
        selectTodolistsStatus: (state) => state.todolistsStatus,
        selectTasksCountForTodolistOnServer: (state, todolistId: string) =>
            state.tasksCountForTodolistOnServer[todolistId],
        selectPaginationPage: (state, todolistId: string) =>
            state.paginationPageForTodolist[todolistId],
    },
});

export const { reducer: todolistsReducer } = todolistsSlice;
export const {
    fetchTodolists,
    addTodolist,
    removeTodolist,
    updateTodolist,
    setTasksCount,
    paginationPageChanged,
} = todolistsSlice.actions;
export const {
    selectTodolistsStatus,
    selectTasksCountForTodolistOnServer,
    selectPaginationPage,
} = todolistsSlice.selectors;
export const { selectIds, selectById } = todolistsAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.todolists,
);
