import { useState } from 'react';

type TaskStatus = 'idle' | 'deleting' | 'changingStatus';

type Props = {
    disabled: boolean;
};

export const Task = (props: Props) => {
    const { disabled } = props;

    const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');

    const deletingTask = taskStatus === 'deleting';

    return (
        <div>
            <input
                disabled={
                    disabled || taskStatus === 'changingStatus' || deletingTask
                }
                type="checkbox"
            />
            <p>task title</p>
            <button disabled={disabled || deletingTask}>X</button>
        </div>
    );
};
