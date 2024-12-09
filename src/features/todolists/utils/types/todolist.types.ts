import { TaskPriority, TaskStatusCodes } from '@/common/enums/enums';

export type Todolist = {
    addedDate: string;
    id: string;
    order: number;
    title: string;
};

export type Task = {
    description: string;
    title: string;
    completed: boolean;
    status: TaskStatusCodes;
    priority: TaskPriority;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};

export type LocalTask = Task & { totalTasksCount: number };

export type TasksData = {
    error: string | null;
    totalCount: number;
    items: Array<Task>;
};

export type NewTodolist = {
    item: Todolist;
};

export type NewTask = {
    item: Task;
};

export type FilterValue = 'all' | 'active' | 'completed';

export type UpdateModel = {
    description: string;
    title: string;
    completed: boolean;
    status: TaskStatusCodes;
    priority: TaskPriority;
    startDate: string;
    deadline: string;
};
