import { RootState } from '@/app/store';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { todolistsApi } from '../api/todolistsApi';
import type { Todolist } from '../utils/types/todolist.types';

type TodolistsStatus = 'idle' | 'loading' | 'success' | 'failure';

const todolistsAdapter = createEntityAdapter<Todolist>({
    sortComparer: (a, b) => b.addedDate.localeCompare(a.addedDate),
});

const todolistsSlice = createAppSlice({
    name: 'todolists',
    initialState: todolistsAdapter.getInitialState({
        todolistsStatus: 'idle' as TodolistsStatus,
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
                pending: (state) => {
                    state.todolistsStatus = 'loading';
                },
                fulfilled: (state, action) => {
                    state.todolistsStatus = 'success';
                    todolistsAdapter.setAll(state, action);
                },
                rejected: (state) => {
                    state.todolistsStatus = 'failure';
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
                    state.todolistsStatus = 'loading';
                },
                fulfilled: (state, action) => {
                    state.todolistsStatus = 'success';
                    todolistsAdapter.addOne(state, action);
                },
                rejected: (state) => {
                    state.todolistsStatus = 'failure';
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
            { fulfilled: todolistsAdapter.removeOne },
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
    }),
    selectors: {
        selectTodolistsStatus: (state) => state.todolistsStatus,
    },
});

export const { reducer: todolistsReducer } = todolistsSlice;
export const { fetchTodolists, addTodolist, removeTodolist, updateTodolist } =
    todolistsSlice.actions;
export const { selectTodolistsStatus } = todolistsSlice.selectors;
export const { selectIds, selectById } = todolistsAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.todolists,
);
