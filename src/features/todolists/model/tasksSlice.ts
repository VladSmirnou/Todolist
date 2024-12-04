import { RootState } from '@/app/store';
import { TaskStatusCodes } from '@/common/enums/enums';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasksApi';
import type { FilterValue, Task } from '../utils/types/todolist.types';

const tasksAdapter = createEntityAdapter<Task>({
    // перенести сортировку в таски отдельно, чтобы не сортировать их все
    // постоянно
    sortComparer: (a, b) => a.order - b.order,
});

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState({
        tasksCountForTodolist: {} as { [key: string]: number },
    }),
    reducers: (create) => ({
        fetchTasks: create.asyncThunk<
            { todolistId: string; tasksCount: number; tasks: Array<Task> },
            { todolistId: string; count: number; page: number }
        >(
            async (args, { rejectWithValue }) => {
                try {
                    const res = await tasksApi.fetchTasks(args);
                    return {
                        tasksCount: res.data.totalCount,
                        tasks: res.data.items,
                        todolistId: args.todolistId,
                    };
                } catch (e) {
                    const errorMessage = (e as AxiosError | Error).message;
                    return rejectWithValue(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    const { tasksCount, tasks, todolistId } = action.payload;
                    state.tasksCountForTodolist[todolistId] = tasksCount;
                    tasksAdapter.addMany(state, tasks);
                },
            },
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
        removeTasks: create.reducer<Array<string>>((state, action) => {
            tasksAdapter.removeMany(state, action.payload);
        }),
        removeLocalTask: create.reducer<string>((state, action) => {
            tasksAdapter.removeOne(state, action);
        }),
    }),
    selectors: {
        selectTasksCount: (state, todolistId: string) =>
            state.tasksCountForTodolist[todolistId],
    },
});

export const { reducer: tasksReducer } = tasksSlise;
export const {
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    removeTasks,
    removeLocalTask,
} = tasksSlise.actions;
export const { selectIds, selectById, selectAll } = tasksAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.tasks,
);
export const { selectTasksCount } = tasksSlise.selectors;

export const selectTasksForTodolist = (
    state: RootState,
    todolistId: string,
) => {
    return selectAll(state)
        .filter((task) => task.todoListId === todolistId)
        .map(({ id }) => id);
};

export const selectFilteredTaskIdsForTodolist = (
    state: RootState,
    filterValue: FilterValue,
    todolistId: string,
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
