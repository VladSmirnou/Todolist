import { useNavigate } from 'react-router-dom';
import { Container } from '../Container/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import s from './TaskDoesntExist.module.css';

export const TaskDoesntExist = () => {
    const navigate = useNavigate();
    return (
        <Container className={s.container}>
            <Typography>This task doesnt exist.</Typography>
            <Button
                className={s.button}
                variant="contained"
                onClick={() => navigate('/')}
            >
                home page
            </Button>
        </Container>
    );
};
