import { RootState } from '@/app/store';
import { TaskStatusCodes } from '@/common/enums/enums';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasksApi';
import type { Task } from '../utils/types/todolist.types';
import { removeTodolist, setTasksCount } from './todolistSlice';
import { FilterValue, TasksStatus } from '../utils/enums/enums';
import { logoutCleanup } from '@/common/utils/commonActions';

const tasksAdapter = createEntityAdapter<Task>();

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState({
        tasksStatus: {} as { [key: string]: TasksStatus },
    }),
    reducers: (create) => ({
        fetchTasks: create.asyncThunk<
            { todolistId: string; tasks: Array<Task> },
            { todolistId: string; count: number; page: number }
        >(
            async (args, { rejectWithValue, dispatch }) => {
                try {
                    const res = await tasksApi.fetchTasks(args);
                    const { totalCount, items } = res.data;
                    dispatch(
                        setTasksCount({
                            todolistId: args.todolistId,
                            tasksCount: totalCount,
                        }),
                    );
                    return {
                        todolistId: args.todolistId,
                        tasks: items,
                    };
                } catch (e) {
                    const errorMessage = (e as AxiosError | Error).message;
                    return rejectWithValue(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    const { todolistId, tasks } = action.payload;
                    state.tasksStatus[todolistId] = TasksStatus.SUCCESS;
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
        >(async (args, { dispatch }) => {
            try {
                const res = await tasksApi.removeTask(args);
                serverErrorHandler(res.data);
                return args.taskId;
            } catch (e) {
                const errorMessage = clientErrorHandler(e, dispatch);
                throw new Error(errorMessage);
            }
        }),
        removeLocalTasks: create.reducer(tasksAdapter.removeMany),
        removeLocalTask: create.reducer(tasksAdapter.removeOne),
        removeLocalOldestTaskForTodolist: create.reducer(
            tasksAdapter.removeOne,
        ),
        tasksStatusChanged: create.reducer<{
            todolistId: string;
            nextTasksStatus: TasksStatus;
        }>((state, action) => {
            const { todolistId, nextTasksStatus } = action.payload;
            state.tasksStatus[todolistId] = nextTasksStatus;
        }),
    }),
    extraReducers: (builder) => {
        builder
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const taskIdsToRemove = Object.values(state.entities)
                    .filter(({ todoListId }) => {
                        return todoListId === action.payload;
                    })
                    .map(({ id }) => id);
                tasksAdapter.removeMany(state, taskIdsToRemove);
            })
            .addCase(logoutCleanup, (state) => {
                state.tasksStatus = {};
                tasksAdapter.removeAll(state);
            });
    },
    selectors: {
        selectTasksStatus: (state, todolistId: string) => {
            return state.tasksStatus[todolistId];
        },
    },
});

export const { reducer: tasksReducer } = tasksSlise;
export const {
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    removeLocalTasks,
    removeLocalOldestTaskForTodolist,
    removeLocalTask,
    tasksStatusChanged,
} = tasksSlise.actions;
export const { selectTasksStatus } = tasksSlise.selectors;

export const { selectIds, selectById, selectEntities } =
    tasksAdapter.getSelectors(
        (state: RootState) => state.todolistEntities.tasks,
    );

export const selectTaskIdsForTodolist = (
    state: RootState,
    todolistId: string,
) => {
    return Object.values(selectEntities(state))
        .filter((task) => task.todoListId === todolistId)
        .sort((a, b) => a.order - b.order)
        .map(({ id }) => id);
};

export const selectFilteredTaskIds = (
    state: RootState,
    taskIds: Array<string>,
    filterValue: FilterValue,
) => {
    let tasks = taskIds.map((id) => selectById(state, id));

    if (filterValue !== FilterValue.ALL) {
        tasks = tasks.filter(
            (task) =>
                (filterValue === FilterValue.ACTIVE &&
                    task.status === TaskStatusCodes.New) ||
                (filterValue === FilterValue.COMPLETED &&
                    task.status === TaskStatusCodes.Completed),
        );
    }

    return tasks.map(({ id }) => id);
};
