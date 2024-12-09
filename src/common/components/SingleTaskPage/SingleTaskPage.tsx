import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import {
    fetchTasks,
    selectById,
    selectTasksStatus,
} from '@/features/todolists/model/tasksSlice';
import {
    fetchTodolists,
    selectTodolistsStatus,
} from '@/features/todolists/model/todolistSlice';
import {
    INITIAL_PAGE,
    TASKS_PER_PAGE,
} from '@/features/todolists/utils/constants/constants';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../Container/Container';
import { TaskDoesntExist } from '../TaskDoesntExist/TaskDoesntExist';
import s from './SingleTaskPage.module.css';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { SingleTaskPageSkeleton } from './Skeleton/Skeleton';

export const SingleTaskPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const todolistsStatus = useAppSelector((state) =>
        selectTodolistsStatus(state.todolistEntities),
    );

    const { taskId } = useParams<TaskIdParams>();
    const task = useAppSelector((state) => selectById(state, taskId!));

    const tasksStatus = useAppSelector((state) =>
        selectTasksStatus(state.todolistEntities, task?.todoListId),
    );

    // Maybe a user saved a single task in the bookmarks,
    // so entering this page directly will show him that this
    // task no longer exists because todolists are not loaded yet,
    // so I need to fetch them here as well if the user is logged
    // in but there are no todolists yet.
    useEffect(() => {
        if (todolistsStatus === 'initialLoading') {
            dispatch(fetchTodolists())
                .unwrap()
                .then((todolists) => {
                    todolists.forEach(({ id }) => {
                        dispatch(
                            fetchTasks({
                                todolistId: id,
                                count: TASKS_PER_PAGE,
                                page: INITIAL_PAGE,
                            }),
                        );
                    });
                })
                .catch((err: string) => {
                    dispatchAppStatusData(dispatch, 'failed', err);
                });
        }
    }, [dispatch, todolistsStatus]);

    if (!tasksStatus) {
        return <SingleTaskPageSkeleton />;
    }

    if (!task) {
        return <TaskDoesntExist />;
    }

    const redirectToUpdateForm = () => {
        navigate(`/update/${taskId}`, { replace: true });
    };

    return (
        <Container className={s.container}>
            <Typography component={'h2'} variant={'h2'}>
                {task.title}
            </Typography>
            <Typography>{task.description}</Typography>
            <ButtonGroup variant="text">
                <Button onClick={redirectToUpdateForm}>edit task</Button>
                <Button onClick={() => navigate(-1)}>back</Button>
            </ButtonGroup>
        </Container>
    );
};
