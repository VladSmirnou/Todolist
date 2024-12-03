import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { todolistsApi } from '../api/todolistsApi';
import { RootState } from '@/app/store';
import type { Todolist } from '../util/types/todolist.types';

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
            async () => {
                const res = await todolistsApi.fetchTodolists();
                return res.data;
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
            async (todolistTitle: string) => {
                const res = await todolistsApi.addTodolist(todolistTitle);
                return res.data.data.item;
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
        removeTodolist: create.asyncThunk(
            async (todolistId: string) => {
                await todolistsApi.removeTodolist(todolistId);
                return todolistId;
            },
            { fulfilled: todolistsAdapter.removeOne },
        ),
        updateTodolist: create.asyncThunk(
            async (args: { todolistId: string; title: string }) => {
                const { todolistId, title } = args;
                await todolistsApi.changeTodolist(args);
                return { id: todolistId, changes: { title } };
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
