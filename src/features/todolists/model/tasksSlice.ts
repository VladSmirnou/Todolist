import { RootState } from '@/app/store';
import { TaskStatusCodes } from '@/common/enums/enums';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasksApi';
import type { FilterValue, Task } from '../utils/types/todolist.types';

const tasksAdapter = createEntityAdapter<Task>();

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState(),
    reducers: (create) => ({
        fetchTasks: create.asyncThunk<Array<Task>, string>(
            async (todolistId: string, { rejectWithValue }) => {
                try {
                    const res = await tasksApi.fetchTasks(todolistId);
                    return res.data.items;
                } catch (e) {
                    const errorMessage = (e as AxiosError | Error).message;
                    return rejectWithValue(errorMessage);
                }
            },
            { fulfilled: tasksAdapter.addMany },
        ),
        addTask: create.asyncThunk<Task, { todolistId: string; title: string }>(
            async (
                args: { todolistId: string; title: string },
                { dispatch },
            ) => {
                try {
                    const res = await tasksApi.addTask(args);
                    serverErrorHandler(res.data);
                    return res.data.data.item;
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            { fulfilled: tasksAdapter.addOne },
        ),
        updateTask: create.asyncThunk(
            async (
                arg: {
                    task: Task;
                    newAttrValues: { status?: number; title?: string };
                },
                { dispatch },
            ) => {
                const { task, newAttrValues } = arg;
                const { todoListId, id } = task;
                const payload = {
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    status: task.status,
                    priority: task.priority,
                    startDate: task.startDate,
                    deadline: task.deadline,
                    ...newAttrValues,
                };
                const data = { todoListId, id, payload };
                try {
                    const res = await tasksApi.updateTask(data);
                    serverErrorHandler(res.data);
                    return res.data.data.item;
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    const { id, ...rest } = action.payload;
                    tasksAdapter.updateOne(state, { id, changes: rest });
                },
            },
        ),
        removeTask: create.asyncThunk<
            string,
            { taskId: string; todoListId: string }
        >(
            async (arg, { dispatch }) => {
                try {
                    const res = await tasksApi.removeTask(arg);
                    serverErrorHandler(res.data);
                    return arg.taskId;
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            { fulfilled: tasksAdapter.removeOne },
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
    filterValue: FilterValue,
) => {
    const taskEntities = selectAll(state);
    const res = taskEntities
        .filter((task) => {
            if (task.todoListId === todolistId) {
                if (filterValue === 'all') {
                    return true;
                } else if (
                    filterValue === 'active' &&
                    task.status === TaskStatusCodes.New
                ) {
                    return true;
                } else if (
                    filterValue === 'completed' &&
                    task.status === TaskStatusCodes.Completed
                ) {
                    return true;
                }
            }
        })
        .map(({ id }) => id);
    return res;
};
