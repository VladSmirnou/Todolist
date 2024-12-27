import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { TaskStatusCodes } from '@/common/enums/enums';
import {
    useRemoveTaskMutation,
    useUpdateTaskMutation,
} from '@/features/todolists/api/tasksApi';
import { bindClasses } from '@/features/todolists/utils/moduleStyleBinder/moduleStyleBinder';
import type { Task as TaskType } from '@/features/todolists/utils/types/todolist.types';
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

const getUpdateData = (
    task: TaskType,
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
    return { todoListId, id, payload };
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
        const payload = getUpdateData(task, {
            status: nextStatus,
        });
        await updateTask(payload);
    };

    // refetch // forseRefetch // refetchOnMountOrArgChange

    const handleTitleChange = async (nextTitle: string) => {
        const payload = getUpdateData(task, {
            title: nextTitle,
        });
        await updateTask(payload);
    };

    const handleDeleteTask = async () => {
        setTaskStatus(TaskStatus.MODIFYING);
        try {
            await removeTask({ taskId, todoListId }).unwrap();
        } catch {
            setTaskStatus(TaskStatus.IDLE);
        }
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
