import { Response } from '@/common/types/types';
import { NewTodolist, Todolist } from '../todolists/utils/types/todolist.types';
import { baseApi } from './baseApi';

const todolistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchTodolists: builder.query<Array<Todolist>, void>({
            query: () => '/todo-lists',
        }),
        addTodolist: builder.mutation<Response<NewTodolist>, string>({
            query: (title) => ({
                url: '/todo-lists',
                method: 'POST',
                body: { title },
            }),
        }),
        removeTodolist: builder.mutation<Response, string>({
            query: (todolistId) => ({
                url: `/todo-lists/${todolistId}`,
                method: 'DELETE',
            }),
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
        }),
    }),
});

export const {
    useFetchTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistMutation,
} = todolistsApi;
