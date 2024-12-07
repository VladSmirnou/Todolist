import { RootState } from '@/app/store';
import { clientErrorHandler } from '@/common/utils/clientErrorHandler';
import { createAppSlice } from '@/common/utils/createAppSlice';
import { serverErrorHandler } from '@/common/utils/serverErrorHandler';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasksApi';
import type { FilterValue, Task } from '../utils/types/todolist.types';
import { TaskStatusCodes } from '@/common/enums/enums';

const tasksAdapter = createEntityAdapter<Task>({
    // перенести сортировку в таски отдельно, чтобы не сортировать их все
    // постоянно
    sortComparer: (a, b) => a.order - b.order,
});

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

const tasksSlise = createAppSlice({
    name: 'tasks',
    initialState: tasksAdapter.getInitialState({
        tasksCountForTodolistOnServer: {} as { [key: string]: number },
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
                    state.tasksCountForTodolistOnServer[todolistId] =
                        tasksCount;
                    tasksAdapter.addMany(state, tasks);
                },
            },
        ),
        addTask: create.asyncThunk<
            { todoListId: string; task: Task },
            { todolistId: string; title: string }
        >(
            async (
                args: { todolistId: string; title: string },
                { dispatch },
            ) => {
                try {
                    const res = await tasksApi.addTask(args);
                    serverErrorHandler(res.data);
                    return {
                        todoListId: args.todolistId,
                        task: res.data.data.item,
                    };
                } catch (e) {
                    const errorMessage = clientErrorHandler(e, dispatch);
                    throw new Error(errorMessage);
                }
            },
            {
                fulfilled: (state, action) => {
                    const { todoListId, task } = action.payload;
                    state.tasksCountForTodolistOnServer[todoListId]++;
                    tasksAdapter.addOne(state, task);
                },
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
    }),
    selectors: {
        selectTasksCountForTodolistOnServer: (state, todolistId: string) =>
            state.tasksCountForTodolistOnServer[todolistId],
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
} = tasksSlise.actions;
export const { selectIds, selectById, selectAll } = tasksAdapter.getSelectors(
    (state: RootState) => state.todolistEntities.tasks,
);
export const { selectTasksCountForTodolistOnServer } = tasksSlise.selectors;

export const selectTaskIdsForTodolist = (
    state: RootState,
    todolistId: string,
) => {
    return selectAll(state)
        .filter((task) => task.todoListId === todolistId)
        .map(({ id }) => id);
};

export const selectFilteredTaskIds = (
    state: RootState,
    taskIds: Array<string>,
    filterValue: FilterValue,
) => {
    const taskIdsSet = new Set(taskIds);

    const tasks = selectAll(state).filter(({ id }) => taskIdsSet.has(id));

    const res = tasks
        .filter((task) => {
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
        })
        .map(({ id }) => id);
    return res;
};
