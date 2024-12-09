import Typography from '@mui/material/Typography';
import { Container } from '../Container/Container';
import s from './ErrorPage.module.css';

export const ErrorPage = () => {
    return (
        <Container className={s.container}>
            <Typography className={s.text} variant="h1">
                This page doesn&#39;t exist
            </Typography>
        </Container>
    );
};
