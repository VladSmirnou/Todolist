import { instance } from '@/common/instance/instance';
import type { Todolist } from '../model/todolistSlice';

export const todolistsApi = {
    fetchTodolists: () => {
        return instance.get<Array<Todolist>>('/todo-lists');
    },
};
