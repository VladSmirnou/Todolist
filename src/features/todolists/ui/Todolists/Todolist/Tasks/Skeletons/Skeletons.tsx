import { TaskSkeleton } from './Skeleton/Skeleton';
import s from './Skeletons.module.css';

export const TasksSkeletons = () => {
    const skeletons = [1, 2, 3].map((n) => {
        return <TaskSkeleton key={n} />;
    });
    return <div className={s.container}>{skeletons}</div>;
};
