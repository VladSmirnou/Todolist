import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { selectById, updateTask } from '@/features/todolists/model/tasksSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../Container/Container';
import s from './EditTaskForm.module.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TaskDoesntExist } from '../TaskDoesntExist/TaskDoesntExist';
import { selectTodolistsStatus } from '@/features/todolists/model/todolistSlice';
import { FormStatus } from './enum';
import { TodolistsStatus } from '@/common/enums/enums';
import { PATH } from '@/app/router/routerConfig';

export const EditTaskForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const todolistStatus = useAppSelector((state) =>
        selectTodolistsStatus(state.todolistEntities),
    );

    const { taskId } = useParams<TaskIdParams>();

    const task = useAppSelector((state) => selectById(state, taskId!));

    const [title, setTitle] = useState(task?.title ?? '');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);

    if (todolistStatus === TodolistsStatus.INITIAL_LOADING) {
        return <Navigate to={PATH.root} replace />;
    }

    if (!task) {
        return <TaskDoesntExist />;
    }

    const disabled = status === FormStatus.UPDATING;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title === task.title) {
            return navigate(`/tasks/${taskId}`, { replace: true });
        }
        if (!title.trim()) {
            setError('Title cannot be empty!');
        } else {
            setStatus(FormStatus.UPDATING);
            dispatch(updateTask({ task, newAttrValues: { title } }))
                .unwrap()
                .then(() => navigate(`/tasks/${taskId}`, { replace: true }))
                .finally(() => setStatus(FormStatus.IDLE));
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
                <div className={s.updateFieldContainer}>
                    <TextField
                        autoFocus
                        size={'small'}
                        value={title}
                        onChange={handleChange}
                        error={!!error}
                        helperText={error}
                        disabled={disabled}
                    />
                    <ButtonGroup variant="text" disabled={disabled}>
                        <Button type="submit">update task</Button>
                        <Button
                            component={Link}
                            type="button"
                            to={`/tasks/${taskId}`}
                            replace
                        >
                            close
                        </Button>
                    </ButtonGroup>
                </div>
            </Box>
        </Container>
    );
};
