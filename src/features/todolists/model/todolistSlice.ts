import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { todolistsApi } from '../api/todolistsApi';
import { RootState } from '@/app/store';
import type { Todolist } from '../util/types/todolist.types';

const todolistsAdapter = createEntityAdapter<Todolist>({
    sortComparer: (a, b) => b.addedDate.localeCompare(a.addedDate),
});

const todolistsSlice = createAppSlice({
    name: 'todolists',
    initialState: todolistsAdapter.getInitialState(),
    reducers: (create) => ({
        fetchTodolists: create.asyncThunk(
            async () => {
                const res = await todolistsApi.fetchTodolists();
                return res.data;
            },
            { fulfilled: todolistsAdapter.setAll },
        ),
        addTodolist: create.asyncThunk(
            async (todolistTitle: string) => {
                const res = await todolistsApi.addTodolist(todolistTitle);
                return res.data.data.item;
            },
            { fulfilled: todolistsAdapter.addOne },
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
});

export const { reducer: todolistsReducer } = todolistsSlice;
export const { fetchTodolists, addTodolist, removeTodolist, updateTodolist } =
    todolistsSlice.actions;
export const { selectIds, selectById } = todolistsAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.todolists,
);
