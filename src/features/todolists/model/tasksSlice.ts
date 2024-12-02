import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const tasksAdapter = createEntityAdapter();

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState(),
    reducers: {},
});

export const { reducer: tasksReducer } = tasksSlise;
