import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Container } from '../Container/Container';
import s from './TaskDoesntExist.module.css';
import { PATH } from '@/app/router/routerConfig';

export const TaskDoesntExist = () => {
    return (
        <Container className={s.container}>
            <Typography>This task doesnt exist.</Typography>
            <Button
                component={Link}
                className={s.button}
                variant="contained"
                to={PATH.root}
                replace
            >
                home page
            </Button>
        </Container>
    );
};
