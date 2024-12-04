import { useAppSelector } from '@/common/hooks/useAppSelector';
import { TaskIdParams } from '@/common/types/types';
import { selectById } from '@/features/todolists/model/tasksSlice';
import { useNavigate, useParams } from 'react-router-dom';

export const SingleTaskPage = () => {
    const navigate = useNavigate();

    const { taskId } = useParams<TaskIdParams>();
    const task = useAppSelector((state) => selectById(state, taskId!));

    if (!task) {
        return (
            <div>
                <p>Task doesnt exist</p>
                <button onClick={() => navigate('/')}>home page</button>
            </div>
        );
    }

    const redirectToUpdateForm = () => {
        navigate(`/update/${taskId}`, { replace: true });
    };

    return (
        <section>
            <p>{task.title}</p>
            <p>{task.description}</p>
            <button onClick={redirectToUpdateForm}>edit task</button>
            <button onClick={() => navigate(-1)}>back</button>
        </section>
    );
};
