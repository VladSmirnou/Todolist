import { useNavigate } from 'react-router-dom';

export const TaskDoesntExist = () => {
    const navigate = useNavigate();
    return (
        <div>
            <p>Task doesnt exist</p>
            <button onClick={() => navigate('/')}>home page</button>
        </div>
    );
};
