import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { selectById } from '@/features/todolists/model/tasksSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../Container/Container';
import s from './SingleTaskPage.module.css';
import { TaskDoesntExist } from '../TaskDoesnExist/TaskDoesntExist';

export const SingleTaskPage = () => {
    const navigate = useNavigate();

    const { taskId } = useParams<TaskIdParams>();
    const task = useAppSelector((state) => selectById(state, taskId!));

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
