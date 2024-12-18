import { instance } from '@/common/instance/instance';
import type { NewTodolist, Todolist } from '../utils/types/todolist.types';
import { Response } from '@/common/types/types';

export const todolistsApi = {
    fetchTodolists: () => {
        return instance.get<Array<Todolist>>('/todo-lists');
    },
    addTodolist: (todolistTitle: string) => {
        return instance.post<Response<NewTodolist>>('/todo-lists', {
            title: todolistTitle,
        });
    },
    removeTodolist: (todolistId: string) => {
        return instance.delete<Response>(`/todo-lists/${todolistId}`);
    },
    changeTodolist: (args: { todolistId: string; title: string }) => {
        const { todolistId, title } = args;
        return instance.put<Response>(`/todo-lists/${todolistId}`, { title });
    },
};
