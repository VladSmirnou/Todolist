import { RootState } from '@/app/store';
import { TaskStatusCodes } from '@/common/enums/enums';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasksApi';
import type { FilterValue, Task } from '../utils/types/todolist.types';
import { setTasksCount } from './todolistSlice';

const tasksAdapter = createEntityAdapter<Task>();

// tasks from the server (order) [-4, -3, -2, -1, 0]
// чем меньше цифра, тем раньше был добавлен таск
// поэтому, т.к. addOne добавляет в конец, надо чтобы
// массив сортировался по возрастанию, чтобы при добавлении
// новой таски убирать .at(-1) (т.е. самый старый элемент) на другую
// страницу.

// tasks per page = 3
// [1 2 3 4 (+ 11, 52, 63 for another todolist)] (on the server, doesn't exist locally)
// remove task 3 on the server
// [1 2 4 (+ 11, 52, 63 for another todolist)]
// server request for todolist1 page 1 \ tasks per page 3 -> [1 2 4]
// tasks locally -> [1 2 3 (+ 11, 52, 63 for another todolist)]
// addMany
// [1 2 [3 needs to be removed] [4 added] (+ 11, 52, 63 for another todolist)]
// removing task 3 locally
// page 1 becomes:
// [1 2 4]

type TasksStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'failure'
    | 'deleting'
    | 'changingPage'
    | 'initialLoading';

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
            async (args, { rejectWithValue, dispatch, getState }) => {
                const status = (getState() as RootState).todolistEntities.tasks
                    .tasksStatus[args.todolistId];
                if (status !== 'deleting' && status !== 'changingPage') {
                    dispatch(
                        tasksStatusChanged({
                            todolistId: args.todolistId,
                            nextTasksStatus:
                                status ? 'loading' : 'initialLoading',
                        }),
                    );
                }
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
                    state.tasksStatus[todolistId] = 'success';
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
    selectors: {
        selectTasksStatus: (state, todolistId: string) =>
            state.tasksStatus[todolistId],
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

    if (filterValue !== 'all') {
        tasks = tasks.filter(
            (task) =>
                (filterValue === 'active' &&
                    task.status === TaskStatusCodes.New) ||
                (filterValue === 'completed' &&
                    task.status === TaskStatusCodes.Completed),
        );
    }

    return tasks.map(({ id }) => id);
};
