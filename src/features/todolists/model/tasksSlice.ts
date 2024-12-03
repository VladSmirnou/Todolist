import { RootState } from '@/app/store';
import { createAppSlice } from '@/common/utils/createAppSlice/createAppSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { tasksApi } from '../api/tasksApi';
import type { Task } from '../util/types/todolist.types';

const tasksAdapter = createEntityAdapter<Task>();

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState(),
    reducers: (create) => ({
        fetchTasks: create.asyncThunk(
            async (todolistId: string) => {
                const res = await tasksApi.fetchTasks(todolistId);
                return res.data.items;
            },
            { fulfilled: tasksAdapter.addMany },
        ),
        addTask: create.asyncThunk(
            async (args: { todolistId: string; title: string }) => {
                const res = await tasksApi.addTask(args);
                return res.data.data.item;
            },
            { fulfilled: tasksAdapter.addOne },
        ),
        updateTask: create.asyncThunk(
            async (arg: {
                task: Task;
                newAttrValues: { status?: number; title?: string };
            }) => {
                const res = await tasksApi.updateTask(
                    arg.task,
                    arg.newAttrValues,
                );
                return res.data.data.item;
            },
            {
                fulfilled: (state, action) => {
                    const { id, ...rest } = action.payload;
                    tasksAdapter.updateOne(state, { id, changes: rest });
                },
            },
        ),
        removeTask: create.asyncThunk(
            async (arg: { taskId: string; todoListId: string }) => {
                await tasksApi.removeTask(arg);
                return arg.taskId;
            },
            {
                fulfilled: tasksAdapter.removeOne,
            },
        ),
    }),
});

export const { reducer: tasksReducer } = tasksSlise;
export const { fetchTasks, addTask, updateTask, removeTask } =
    tasksSlise.actions;
export const { selectIds, selectById, selectAll } = tasksAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.tasks,
);

export const selectTasksIdsForTodolist = (
    state: RootState,
    todolistId: string,
) => {
    const taskEntities = selectAll(state);
    const res = taskEntities
        .filter((task) => task.todoListId === todolistId)
        .map(({ id }) => id);
    return res;
};
