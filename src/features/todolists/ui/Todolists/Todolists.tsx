import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { fetchTasks } from '../../model/tasksSlice';
import {
    fetchTodolists,
    selectIds,
    selectTodolistsStatus,
} from '../../model/todolistSlice';
import { INITIAL_PAGE, TASKS_PER_PAGE } from '../../utils/constants/constants';
import { TodolistSkeleton } from './Skeletons/Skeleton/Skeleton';
import { TodolistsSkeletons } from './Skeletons/Skeletons';
import { Todolist } from './Todolist/Todolist';
import s from './Todolists.module.css';

export const Todolists = () => {
    const todolistsStatus = useAppSelector((state) =>
        selectTodolistsStatus(state.todolistEntities),
    );

    const dispatch = useAppDispatch();

    const todolistsIds = useAppSelector(selectIds);

    useEffect(() => {
        // позволит не перезапрашивать таски после
        // повторных маунтов этого компонента.
        if (todolistsStatus === 'initialLoading') {
            dispatch(fetchTodolists())
                .unwrap()
                .then((todolists) => {
                    todolists.forEach(({ id }) => {
                        dispatch(
                            fetchTasks({
                                todolistId: id,
                                count: TASKS_PER_PAGE,
                                page: INITIAL_PAGE,
                            }),
                        );
                    });
                })
                .catch((err: string) => {
                    dispatchAppStatusData(dispatch, 'failed', err);
                });
        }
    }, [dispatch, todolistsStatus]);

    let content;

    if (todolistsIds.length > 0) {
        content = (
            <>
                {todolistsStatus === 'loading' && <TodolistSkeleton />}
                {todolistsIds.map((tId) => {
                    return <Todolist key={tId} todolistId={tId} />;
                })}
            </>
        );
    } else if (todolistsStatus === 'loading') {
        content = <TodolistSkeleton />;
    } else if (todolistsStatus === 'initialLoading') {
        content = <TodolistsSkeletons amount={4} />;
    } else {
        content = <Typography>You dont have any todolists yet!</Typography>;
    }

    return <div className={s.container}>{content}</div>;
};
