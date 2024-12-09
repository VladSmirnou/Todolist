import { Skeleton } from '@mui/material';
import s from './Skeleton.module.css';

export const SingleTaskPageSkeleton = () => {
    return (
        <div>
            <Skeleton width={100} height={72} />
            <div className={s.buttons}>
                <Skeleton width={87} height={37} />
                <Skeleton width={50} height={37} />
            </div>
        </div>
    );
};
