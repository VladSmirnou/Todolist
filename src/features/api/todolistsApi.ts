import type { Response } from '@/common/types/types';
import type {
    NewTodolist,
    Todolist,
} from '../todolists/utils/types/todolist.types';
import { baseApi } from './baseApi';

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
            invalidatesTags: ['Todolists'],
        }),
        removeTodolist: builder.mutation<Response, string>({
            query: (todolistId) => ({
                url: `/todo-lists/${todolistId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todolists'],
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
            invalidatesTags: ['Todolists'],
        }),
    }),
});

export const {
    useFetchTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistMutation,
} = todolistsApi;
