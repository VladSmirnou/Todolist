import {
    NewTask,
    TasksData,
    UpdateModel,
} from '../todolists/utils/types/todolist.types';
import { baseApi } from './baseApi';
import { Response } from '@/common/types/types';

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchTasks: builder.query<
            TasksData,
            { todolistId: string; count: number; page: number }
        >({
            query: ({ todolistId, count, page }) => ({
                url: `/todo-lists/${todolistId}/tasks`,
                params: { count, page },
            }),
        }),
        addTask: builder.mutation<
            Response<NewTask>,
            { todolistId: string; title: string }
        >({
            query: ({ todolistId, title }) => ({
                url: `/todo-lists/${todolistId}/tasks`,
                method: 'POST',
                body: { title },
            }),
        }),
        removeTask: builder.mutation<
            Response,
            { taskId: string; todoListId: string }
        >({
            query: ({ taskId, todoListId }) => ({
                url: `/todo-lists/${todoListId}/tasks/${taskId}`,
                method: 'DELETE',
            }),
        }),
        updateTask: builder.mutation<
            Response<NewTask>,
            {
                todoListId: string;
                id: string;
                payload: UpdateModel;
            }
        >({
            query: ({ todoListId, id, payload }) => ({
                url: `/todo-lists/${todoListId}/tasks/${id}`,
                method: 'PUT',
                body: payload,
            }),
        }),
    }),
});

export const {
    useFetchTasksQuery,
    useAddTaskMutation,
    useRemoveTaskMutation,
    useUpdateTaskMutation,
} = tasksApi;
