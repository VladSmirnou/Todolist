import { instance } from '@/common/instance/instance';
import type { NewTodolist, Todolist } from '../util/types/todolist.types';
import { Respose } from '@/common/types/types';

export const todolistsApi = {
    fetchTodolists: () => {
        return instance.get<Array<Todolist>>('/todo-lists');
    },
    addTodolist: (todolistTitle: string) => {
        return instance.post<Respose<NewTodolist>>('/todo-lists', {
            title: todolistTitle,
        });
    },
};
