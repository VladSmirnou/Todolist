import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { fetchTodolists, selectIds } from '../../model/todolistSlice';
import { Todolist } from './Todolist/Todolist';
import { Loader } from '@/common/components/Loader/Loader';

export const Todolists = () => {
    const [loadingTodolists, setLoadingTodolists] = useState(true);

    const dispatch = useAppDispatch();

    const todolistsIds = useAppSelector(selectIds);

    useEffect(() => {
        dispatch(fetchTodolists()).finally(() => setLoadingTodolists(false));
    }, [dispatch]);

    let content;

    if (loadingTodolists) {
        content = <Loader />;
    } else if (todolistsIds.length === 0) {
        content = <p>You dont have any todolists yet!</p>;
    } else {
        content = todolistsIds.map((tId) => {
            return <Todolist key={tId} todolistId={tId} />;
        });
    }

    return <div style={{ backgroundColor: 'pink' }}>{content}</div>;
};
