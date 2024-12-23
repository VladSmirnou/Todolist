import { useFetchTodolistsQuery } from '@/features/api/todolistsApi';
import Typography from '@mui/material/Typography';
import { TodolistSkeleton } from './Skeletons/Skeleton/Skeleton';
import { TodolistsSkeletons } from './Skeletons/Skeletons';
import { Todolist } from './Todolist/Todolist';
import s from './Todolists.module.css';

export const Todolists = () => {
    const {
        data: todolists = [],
        isLoading,
        isFetching,
    } = useFetchTodolistsQuery();

    let content;

    if (isLoading) {
        content = <TodolistsSkeletons amount={4} />;
    } else if (todolists.length > 0) {
        content = (
            <>
                {isFetching && <TodolistSkeleton />}
                {todolists.map((tl) => {
                    return <Todolist key={tl.id} todolist={tl} />;
                })}
            </>
        );
    } else if (isFetching) {
        content = <TodolistSkeleton />;
    } else {
        content = <Typography>You dont have any todolists yet!</Typography>;
    }

    return <div className={s.container}>{content}</div>;
};
