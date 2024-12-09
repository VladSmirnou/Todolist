import { Skeleton } from '@mui/material';

export const TaskSkeleton = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width={24} height={40} />
            <Skeleton width={243} height={40} />
            <Skeleton width={24} height={40} />
        </div>
    );
};
