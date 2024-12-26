import { PATH } from '@/app/router/routerConfig';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { TaskIdParams } from '@/common/types/types';
import { tasksApi, useFetchTasksQuery } from '@/features/api/tasksApi';
import { todolistsApi } from '@/features/api/todolistsApi';
import { Task } from '@/features/todolists/utils/types/todolist.types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Container } from '../Container/Container';
import { TaskDoesntExist } from '../TaskDoesntExist/TaskDoesntExist';
import s from './SingleTaskPage.module.css';
import { SingleTaskPageSkeleton } from './Skeleton/Skeleton';

type Props = {
    todolistId: string;
    taskId: string;
};

const NavigatedFromTask = (props: Props) => {
    const { todolistId, taskId } = props;

    const { data: tasks, isFetching } = useFetchTasksQuery({ todolistId });

    if (isFetching) {
        return <SingleTaskPageSkeleton />;
    }

    const task = tasks?.items.find((task) => task.id === taskId);

    if (!task) {
        return <TaskDoesntExist />;
    } else {
        return <UI task={task} />;
    }
};

const NavigatedFromOutside = ({ taskId }: { taskId: string }) => {
    const dispatch = useAppDispatch();

    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        dispatch(todolistsApi.endpoints.fetchTodolists.initiate())
            .unwrap()
            .then((todolists) => {
                return Promise.all(
                    todolists.map((tl) => {
                        return dispatch(
                            tasksApi.endpoints.fetchTasks.initiate({
                                todolistId: tl.id,
                            }),
                        ).unwrap();
                    }),
                );
            })
            .then((tasksData) => {
                for (const { items: tasks } of tasksData) {
                    const task = tasks.find((task) => task.id === taskId);
                    if (task) {
                        setTask(task);
                        break;
                    }
                }
            })
            .finally(() => setTasksLoaded(true));
    }, [dispatch, taskId]);

    if (!tasksLoaded) {
        return <SingleTaskPageSkeleton />;
    }

    if (!task) {
        return <TaskDoesntExist />;
    }

    return <UI task={task} />;
};

const UI = ({ task }: { task: Task }) => {
    return (
        <Container className={s.container}>
            <Typography component={'h2'} variant={'h2'}>
                {task.title}
            </Typography>
            <Typography>{task.description}</Typography>
            <ButtonGroup variant="text">
                <Button
                    component={Link}
                    to={`/update/${task.id}`}
                    state={task.todoListId}
                    replace
                >
                    edit task
                </Button>
                <Button component={Link} to={PATH.root}>
                    back to todolists
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export const SingleTaskPage = () => {
    const location = useLocation();
    const { taskId } = useParams<TaskIdParams>();

    const locationState = location.state as string | null;

    window.history.replaceState(null, '');

    let content;
    if (!locationState) {
        content = <NavigatedFromOutside taskId={taskId as string} />;
    } else {
        content = (
            <NavigatedFromTask
                todolistId={locationState}
                taskId={taskId as string}
            />
        );
    }
    return content;
};
