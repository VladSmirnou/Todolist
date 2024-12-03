import { instance } from '@/common/instance/instance';
import type { NewTask, Task, TasksData } from '../util/types/todolist.types';
import { Response } from '@/common/types/types';

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
    updateTask: (
        task: Task,
        newAttrValues: { status?: number; title?: string },
    ) => {
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
        return instance.put<Response<NewTask>>(
            `/todo-lists/${todoListId}/tasks/${id}`,
            payload,
        );
    },
};
