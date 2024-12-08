import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { selectById, updateTask } from '@/features/todolists/model/tasksSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../Container/Container';
import s from './EditTaskForm.module.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TaskDoesntExist } from '../TaskDoesnExist/TaskDoesntExist';

type FormStatus = 'idle' | 'updating';

export const EditTaskForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { taskId } = useParams<TaskIdParams>();

    const task = useAppSelector((state) => selectById(state, taskId!));

    const [title, setTitle] = useState(task?.title ?? '');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>('idle');

    if (!task) {
        return <TaskDoesntExist />;
    }

    const disabled = status === 'updating';

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
        <Container className={s.container}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
            >
                <fieldset disabled={disabled} className={s.fieldset}>
                    <TextField
                        autoFocus
                        size={'small'}
                        value={title}
                        onChange={handleChange}
                        error={!!error}
                        helperText={error}
                    />
                    <ButtonGroup variant="text">
                        <Button type="submit">update task</Button>
                        <Button
                            type="button"
                            onClick={() =>
                                navigate(`/tasks/${taskId}`, {
                                    replace: true,
                                })
                            }
                        >
                            close
                        </Button>
                    </ButtonGroup>
                </fieldset>
            </Box>
        </Container>
    );
};
