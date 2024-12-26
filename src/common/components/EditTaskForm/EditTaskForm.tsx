import { PATH } from '@/app/router/routerConfig';
import { TaskIdParams } from '@/common/types/types';
import {
    useFetchTasksQuery,
    useUpdateTaskMutation,
} from '@/features/api/tasksApi';
import { UpdateModel } from '@/features/todolists/utils/types/todolist.types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { Container } from '../Container/Container';
import { TaskDoesntExist } from '../TaskDoesntExist/TaskDoesntExist';
import s from './EditTaskForm.module.css';
import { FormStatus } from './enum';

type Props = {
    todolistId: string;
};

const NavigatedFromSingleTaskPage = (props: Props) => {
    const { todolistId } = props;

    const navigate = useNavigate();
    const { taskId } = useParams<TaskIdParams>();

    const { data: tasks } = useFetchTasksQuery({ todolistId });
    const [updateTask] = useUpdateTaskMutation();

    const task = tasks?.items.find((task) => task.id === taskId);

    const [title, setTitle] = useState(task?.title ?? '');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);

    if (!task) {
        return <TaskDoesntExist />;
    }

    const disabled = status === FormStatus.UPDATING;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title === task.title) {
            return navigate(`/tasks/${taskId}`, {
                state: task.todoListId,
                replace: true,
            });
        }
        if (!title.trim()) {
            setError('Title cannot be empty!');
        } else {
            setStatus(FormStatus.UPDATING);
            const { todoListId, id } = task;
            const payload: UpdateModel = {
                title,
                description: task.description,
                completed: task.completed,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            };
            const data = { todoListId, id, payload };
            updateTask(data)
                .unwrap()
                .then(
                    () => {
                        navigate(`/tasks/${taskId}`, {
                            state: task.todoListId,
                            replace: true,
                        });
                    },
                    () => setStatus(FormStatus.IDLE),
                );
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
                            state={task.todoListId}
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

export const EditTaskForm = () => {
    const location = useLocation();

    const locationState = location.state as string | null;

    // It seems like that 'location' is getting the state from the
    // window.state, so setting 'location.state = null' will not
    // restore it. Going back to this url directly will preserve
    // state, but I don't want to allow it.
    window.history.replaceState(null, '');

    let content;
    if (!locationState) {
        content = <Navigate to={PATH.root} replace />;
    } else {
        content = <NavigatedFromSingleTaskPage todolistId={locationState} />;
    }
    location.state = null;
    return content;
};
