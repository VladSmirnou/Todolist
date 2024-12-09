import Skeleton from '@mui/material/Skeleton';
import s from './Skeleton.module.css';

export const TodolistSkeleton = () => {
    return (
        <div className={s.skeleton}>
            <Skeleton
                variant="rounded"
                width={'140px'}
                height={'40px'}
                sx={{ bgcolor: 'grey.400' }}
            />
            <Skeleton
                variant="rounded"
                width={'210px'}
                height={'40px'}
                sx={{ bgcolor: 'grey.400' }}
            />
            <Skeleton
                variant="rounded"
                width={'325px'}
                height={'24px'}
                sx={{ bgcolor: 'grey.400' }}
            />
            <Skeleton
                variant="rounded"
                width={'325px'}
                height={'37px'}
                sx={{ bgcolor: 'grey.400' }}
            />
        </div>
    );
};
