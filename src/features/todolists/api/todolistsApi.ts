import type { Response } from '@/common/types/types';
import { baseApi } from '@/app/api/baseApi';
import { Todolist, NewTodolist } from '../utils/types/todolist.types';

export const todolistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchTodolists: builder.query<Array<Todolist>, void>({
            query: () => '/todo-lists',
            providesTags: ['Todolists'],
        }),
        addTodolist: builder.mutation<Response<NewTodolist>, string>({
            query: (title) => ({
                url: '/todo-lists',
                method: 'POST',
                body: { title },
            }),
            invalidatesTags: (res, err) => {
                if (err) return [];
                return ['Todolists'];
            },
        }),
        removeTodolist: builder.mutation<Response, string>({
            query: (todolistId) => ({
                url: `/todo-lists/${todolistId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (res, err) => {
                if (err) return [];
                return ['Todolists'];
            },
        }),
        updateTodolist: builder.mutation<
            Response,
            { todolistId: string; title: string }
        >({
            query: ({ todolistId, title }) => ({
                url: `/todo-lists/${todolistId}`,
                method: 'PUT',
                body: { title },
            }),
            invalidatesTags: (res, err) => {
                if (err) return [];
                return ['Todolists'];
            },
        }),
    }),
});

export const {
    useFetchTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistMutation,
} = todolistsApi;
