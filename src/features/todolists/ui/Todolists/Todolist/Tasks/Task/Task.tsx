import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { TaskStatusCodes } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import {
    fetchTasks,
    removeLocalTask,
    removeTask,
    selectById,
    updateTask,
} from '@/features/todolists/model/tasksSlice';
import { TASKS_PER_PAGE } from '@/features/todolists/utils/constants/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';

type TaskStatus = 'idle' | 'deleting' | 'changingStatus' | 'changingTitle';

type Props = {
    disabled: boolean;
    taskId: string;
    page: number;
};

export const Task = (props: Props) => {
    const { disabled: deletingTodolist, taskId, page } = props;

    const dispatch = useAppDispatch();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');

    const task = useAppSelector((state) => selectById(state, taskId));

    const { title, status, todoListId, id } = task;

    const deletingTask = taskStatus === 'deleting';
    const changingTaskStatus = taskStatus === 'changingStatus';
    const changingTaskTitle = taskStatus === 'changingTitle';

    const combinedCase = deletingTodolist || deletingTask;

    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskStatus('changingStatus');
        const nextStatus =
            e.target.checked ? TaskStatusCodes.Completed : TaskStatusCodes.New;
        dispatch(
            updateTask({ task, newAttrValues: { status: nextStatus } }),
        ).finally(() => setTaskStatus('idle'));
    };

    const handleTitleChange = (nextTitle: string) => {
        setTaskStatus('changingTitle');
        dispatch(
            updateTask({ task, newAttrValues: { title: nextTitle } }),
        ).finally(() => setTaskStatus('idle'));
    };

    const handleDeleteTask = async () => {
        setTaskStatus('deleting');
        try {
            await dispatch(removeTask({ taskId, todoListId })).unwrap();
        } catch {
            setTaskStatus('idle');
            return;
        }
        try {
            await dispatch(
                fetchTasks({
                    todolistId: todoListId,
                    count: TASKS_PER_PAGE,
                    page,
                }),
            ).unwrap();
        } finally {
            // Если таск был удален с сервера успешно, мне не важно как завершиться
            // fetch запрос, мне надо удалить таск локально, но только после того,
            // как завершится запрос, чтобы ui не дергался
            dispatch(removeLocalTask(taskId));
        }
        setTaskStatus('idle');
    };

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
                navigateToLink={`/tasks/${id}`}
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
