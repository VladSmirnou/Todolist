import { instance } from '@/common/instance/instance';
import { Response } from '@/common/types/types';
import type {
    NewTask,
    TasksData,
    UpdateModel,
} from '../utils/types/todolist.types';

export const tasksApi = {
    fetchTasks: (todolistId: string) => {
        return instance.get<TasksData>(`/todo-lists/${todolistId}/tasks`);
    },
    addTask: (args: { todolistId: string; title: string }) => {
        const { todolistId, title } = args;
        return instance.post<Response<NewTask>>(
            `/todo-lists/${todolistId}/tasks`,
            { title },
        );
    },
    removeTask: (args: { taskId: string; todoListId: string }) => {
        const { taskId, todoListId } = args;
        return instance.delete<Response>(
            `/todo-lists/${todoListId}/tasks/${taskId}`,
        );
    },
    updateTask: (data: {
        todoListId: string;
        id: string;
        payload: UpdateModel;
    }) => {
        const { todoListId, id, payload } = data;
        return instance.put<Response<NewTask>>(
            `/todo-lists/${todoListId}/tasks/${id}`,
            payload,
        );
    },
};
