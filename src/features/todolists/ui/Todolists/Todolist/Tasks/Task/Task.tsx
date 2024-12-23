import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { TaskStatusCodes } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import {
    fetchTasks,
    removeLocalTask,
    removeTask,
    tasksStatusChanged,
    updateTask,
} from '@/features/todolists/model/tasksSlice';
import { TASKS_PER_PAGE } from '@/features/todolists/utils/constants/constants';
import { TasksStatus } from '@/features/todolists/utils/enums/enums';
import { bindClasses } from '@/features/todolists/utils/moduleStyleBinder/moduleStyleBinder';
import type { Task as TaskType } from '@/features/todolists/utils/types/todolist.types';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';
import s from './Task.module.css';

enum TaskStatus {
    IDLE = 'idle',
    DELETING = 'deleting',
    CHANGING_STATUS = 'changingStatus',
    CHANGING_TITLE = 'changingTitle',
}

type Props = {
    disabled: boolean;
    task: TaskType;
    page: number;
};

export const Task = (props: Props) => {
    const { disabled: deletingTodolist, task, page } = props;

    const dispatch = useAppDispatch();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.IDLE);

    const { title, status, todoListId, id: taskId } = task;

    const deletingTask = taskStatus === TaskStatus.DELETING;
    const changingTaskStatus = taskStatus === TaskStatus.CHANGING_STATUS;
    const changingTaskTitle = taskStatus === TaskStatus.CHANGING_TITLE;

    const combinedCase = deletingTodolist || deletingTask;

    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskStatus(TaskStatus.CHANGING_STATUS);
        const nextStatus =
            e.target.checked ? TaskStatusCodes.Completed : TaskStatusCodes.New;
        dispatch(
            updateTask({ task, newAttrValues: { status: nextStatus } }),
        ).finally(() => setTaskStatus(TaskStatus.IDLE));
    };

    const handleTitleChange = (nextTitle: string) => {
        setTaskStatus(TaskStatus.CHANGING_TITLE);
        dispatch(
            updateTask({ task, newAttrValues: { title: nextTitle } }),
        ).finally(() => setTaskStatus(TaskStatus.IDLE));
    };

    const handleDeleteTask = async () => {
        setTaskStatus(TaskStatus.DELETING);
        dispatch(
            tasksStatusChanged({
                todolistId: todoListId,
                nextTasksStatus: TasksStatus.DELETING_TASK,
            }),
        );
        try {
            await dispatch(removeTask({ taskId, todoListId })).unwrap();
        } catch {
            setTaskStatus(TaskStatus.IDLE);
            dispatch(
                tasksStatusChanged({
                    todolistId: todoListId,
                    nextTasksStatus: TasksStatus.IDLE,
                }),
            );
            return;
        }
        try {
            await dispatch(
                fetchTasks({
                    todolistId: todoListId,
                    count: TASKS_PER_PAGE,
                    page,
                }),
            );
        } finally {
            // Если таск был удален с сервера успешно, мне не важно как завершиться
            // fetch запрос, мне надо удалить таск локально, но только после того,
            // как завершится запрос, чтобы ui не дергался
            dispatch(removeLocalTask(taskId));
        }
        setTaskStatus(TaskStatus.IDLE);
        dispatch(
            tasksStatusChanged({
                todolistId: todoListId,
                nextTasksStatus: TasksStatus.IDLE,
            }),
        );
    };

    const cx = bindClasses({ taskTitleDisabled: s.taskTitleDisabled });
    const className = cx(s.taskTitle, {
        taskTitleDisabled: combinedCase || changingTaskTitle,
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
                disabled={combinedCase || changingTaskStatus}
                checked={status === TaskStatusCodes.Completed}
                onChange={handleStatusChange}
            />
            <EditableSpan
                spanText={title}
                onEdit={handleTitleChange}
                disabled={combinedCase || changingTaskTitle}
                navigateToLink={`/tasks/${taskId}`}
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
