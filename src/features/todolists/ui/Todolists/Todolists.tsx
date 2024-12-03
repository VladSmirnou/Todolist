import { Loader } from '@/common/components/Loader/Loader';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { useLayoutEffect } from 'react';
import { fetchTasks } from '../../model/tasksSlice';
import {
    fetchTodolists,
    selectIds,
    selectTodolistsStatus,
} from '../../model/todolistSlice';
import { Todolist } from './Todolist/Todolist';

export const Todolists = () => {
    const todolistsStatus = useAppSelector((state) =>
        selectTodolistsStatus(state.todolistEntities),
    );

    const dispatch = useAppDispatch();

    const todolistsIds = useAppSelector(selectIds);

    useLayoutEffect(() => {
        dispatch(fetchTodolists())
            .unwrap()
            .then((todolists) => {
                todolists.forEach(({ id }) => {
                    dispatch(fetchTasks(id));
                });
            });
    }, [dispatch]);

    let content;

    if (todolistsIds.length > 0) {
        content = (
            <>
                {todolistsStatus === 'loading' && <Loader />}
                {todolistsIds.map((tId) => {
                    return <Todolist key={tId} todolistId={tId} />;
                })}
            </>
        );
    } else if (todolistsStatus === 'loading') {
        content = <Loader />;
    } else {
        content = <p>You dont have any todolists yet!</p>;
    }

    return <div style={{ backgroundColor: 'pink' }}>{content}</div>;
};
