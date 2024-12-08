import Typography from '@mui/material/Typography';
import s from './Title.module.css';

export const Title = () => {
    return (
        <div className={s.container}>
            <Typography>
                To login get registered <a href="#">here</a>
            </Typography>
            <Typography>or use common test account credentials:</Typography>
            <Typography>
                <b>Email</b>: free@samuraijs.com
            </Typography>
            <Typography>
                <b>Password</b>: free
            </Typography>
        </div>
    );
};
