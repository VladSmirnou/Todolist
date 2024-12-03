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

type TaskStatus = 'idle' | 'deleting' | 'changingStatus';

type Props = {
    disabled: boolean;
    taskId: string;
};

export const Task = (props: Props) => {
    const { disabled, taskId } = props;

    const dispatch = useAppDispatch();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');

    const task = useAppSelector((state) => selectById(state, taskId));

    const { title, status, todoListId } = task;

    const deletingTask = taskStatus === 'deleting';

    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextStatus =
            e.target.checked ? TaskStatusCodes.Completed : TaskStatusCodes.New;
        dispatch(updateTask({ task, newAttrValues: { status: nextStatus } }));
    };

    const handleTitleChange = (nextTitle: string) => {
        dispatch(updateTask({ task, newAttrValues: { title: nextTitle } }));
    };

    const handleDeleteTask = () => {
        dispatch(removeTask({ taskId, todoListId }));
    };

    return (
        <div>
            <input
                disabled={
                    disabled || taskStatus === 'changingStatus' || deletingTask
                }
                type="checkbox"
                onChange={handleStatusChange}
                checked={status === TaskStatusCodes.Completed}
            />
            <EditableSpan spanText={title} onEdit={handleTitleChange} />
            <button
                disabled={disabled || deletingTask}
                onClick={handleDeleteTask}
            >
                X
            </button>
        </div>
    );
};
