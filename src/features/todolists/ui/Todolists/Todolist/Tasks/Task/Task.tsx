import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { TaskStatusCodes } from '@/common/enums/enums';
import {
    useRemoveTaskMutation,
    useUpdateTaskMutation,
} from '@/features/api/tasksApi';
import { bindClasses } from '@/features/todolists/utils/moduleStyleBinder/moduleStyleBinder';
import type {
    Task as TaskType,
    UpdateModel,
} from '@/features/todolists/utils/types/todolist.types';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';
import s from './Task.module.css';

enum TaskStatus {
    IDLE = 'idle',
    MODIFYING = 'modifying',
}

type Props = {
    disabled: boolean;
    task: TaskType;
    paginationPage: number;
};

export const Task = (props: Props) => {
    const { disabled: deletingTodolist, task } = props;

    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.IDLE);

    const [updateTask] = useUpdateTaskMutation();
    const [removeTask] = useRemoveTaskMutation();

    const { title, status, id: taskId, todoListId } = task;

    const modifying = taskStatus === TaskStatus.MODIFYING;

    const combinedCase = deletingTodolist || modifying;

    const handleStatusChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const nextStatus =
            e.target.checked ? TaskStatusCodes.Completed : TaskStatusCodes.New;
        const { todoListId, id } = task;
        const payload: UpdateModel = {
            title: task.title,
            description: task.description,
            completed: task.completed,
            status: nextStatus,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
        };
        const data = { todoListId, id, payload };
        await updateTask(data);
    };

    const handleTitleChange = async (nextTitle: string) => {
        const { todoListId, id } = task;
        const payload: UpdateModel = {
            title: nextTitle,
            description: task.description,
            completed: task.completed,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
        };
        const data = { todoListId, id, payload };
        await updateTask(data);
    };

    const handleDeleteTask = async () => {
        setTaskStatus(TaskStatus.MODIFYING);
        await removeTask({ taskId, todoListId });
    };

    const cx = bindClasses({ taskTitleDisabled: s.taskTitleDisabled });
    const className = cx(s.taskTitle, {
        taskTitleDisabled: combinedCase,
    });

    return (
        <li
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Checkbox
                disabled={combinedCase}
                checked={status === TaskStatusCodes.Completed}
                onChange={handleStatusChange}
            />
            <EditableSpan
                spanText={title}
                onEdit={handleTitleChange}
                disabled={combinedCase}
                navigateToLink={`/tasks/${taskId}`}
                linkStateData={task.todoListId}
                className={className}
            />
            <IconButton
                disabled={combinedCase}
                onClick={handleDeleteTask}
                aria-label="delete"
                size="medium"
            >
                <DeleteIcon fontSize="inherit" />
            </IconButton>
        </li>
    );
};
