import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { selectById, updateTask } from '@/features/todolists/model/tasksSlice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type FormStatus = 'idle' | 'updating';

export const EditTaskForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { taskId } = useParams<TaskIdParams>();

    const task = useAppSelector((state) => selectById(state, taskId!));

    const [title, setTitle] = useState(task.title);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>('idle');

    const disabled = status === 'updating';

    if (!task) {
        return (
            <div>
                <p>Task doesnt exist</p>
                <button onClick={() => navigate('/')}>home page</button>
            </div>
        );
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title cannot be empty!');
        } else {
            setStatus('updating');
            dispatch(updateTask({ task, newAttrValues: { title } }))
                .unwrap()
                .then(() => navigate(`/tasks/${taskId}`, { replace: true }))
                .finally(() => setStatus('idle'));
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setTitle(e.target.value);
    };

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={disabled}>
                    <input type="text" onChange={handleChange} value={title} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                        <button type="submit">update task</button>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/tasks/${taskId}`, { replace: true })
                            }
                        >
                            close
                        </button>
                    </div>
                </fieldset>
            </form>
        </section>
    );
};
