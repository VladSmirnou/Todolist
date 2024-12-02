import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { todolistsApi } from '../api/todolistsApi';
import { RootState } from '@/app/store';

export type Todolist = {
    addedDate: string;
    id: string;
    order: number;
    title: string;
};

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
    }),
});

export const { reducer: todolistsReducer } = todolistsSlice;
export const { fetchTodolists } = todolistsSlice.actions;
export const { selectIds, selectById } = todolistsAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.todolists,
);
