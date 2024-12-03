import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { TaskStatusCodes } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import {
    removeTask,
    selectById,
    updateTask,
} from '@/features/todolists/model/tasksSlice';
import { ChangeEvent, useState } from 'react';

type TaskStatus = 'idle' | 'deleting' | 'changingStatus' | 'changingTitle';

type Props = {
    disabled: boolean;
    taskId: string;
};

export const Task = (props: Props) => {
    const { disabled: deletingTodolist, taskId } = props;

    const dispatch = useAppDispatch();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');

    const task = useAppSelector((state) => selectById(state, taskId));

    const { title, status, todoListId } = task;

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

    const handleDeleteTask = () => {
        setTaskStatus('deleting');
        dispatch(removeTask({ taskId, todoListId })).finally(() =>
            setTaskStatus('idle'),
        );
    };

    return (
        <li>
            <input
                disabled={combinedCase || changingTaskStatus}
                type="checkbox"
                onChange={handleStatusChange}
                checked={status === TaskStatusCodes.Completed}
            />
            <EditableSpan
                spanText={title}
                onEdit={handleTitleChange}
                disabled={combinedCase || changingTaskTitle}
            />
            <button disabled={combinedCase} onClick={handleDeleteTask}>
                X
            </button>
        </li>
    );
};
