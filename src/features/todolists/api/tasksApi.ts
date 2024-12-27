import { baseApi } from '@/app/api/baseApi';
import { TasksData, NewTask, UpdateModel } from '../utils/types/todolist.types';
import { Response } from '@/common/types/types';

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchTasks: builder.query<
            TasksData,
            { todolistId: string; params?: { count: number; page: number } }
        >({
            query: ({ todolistId, params = {} }) => ({
                url: `/todo-lists/${todolistId}/tasks`,
                params,
            }),
            providesTags: (res, _, { todolistId }) => {
                if (res) {
                    return [{ type: 'Tasks', id: todolistId }];
                }
                return [];
            },
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
            invalidatesTags: (res, _, { todolistId }) => {
                if (res) {
                    return [{ type: 'Tasks', id: todolistId }];
                }
                return [];
            },
        }),
        removeTask: builder.mutation<
            Response,
            { taskId: string; todoListId: string }
        >({
            query: ({ taskId, todoListId }) => ({
                url: `/todo-lists/${todoListId}/tasks/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (res, _, { todoListId }) => {
                if (res) {
                    return [{ type: 'Tasks', id: todoListId }];
                }
                return [];
            },
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
            invalidatesTags: (res, _, { todoListId }) => {
                if (res) {
                    return [{ type: 'Tasks', id: todoListId }];
                }
                return [];
            },
        }),
    }),
});

export const {
    useFetchTasksQuery,
    useAddTaskMutation,
    useRemoveTaskMutation,
    useUpdateTaskMutation,
} = tasksApi;
