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
    }),
});

export const { reducer: todolistsReducer } = todolistsSlice;
export const { fetchTodolists, addTodolist } = todolistsSlice.actions;
export const { selectIds, selectById } = todolistsAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.todolists,
);
