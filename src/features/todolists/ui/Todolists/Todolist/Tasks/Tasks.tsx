import { Loader } from '@/common/components/Loader/Loader';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import {
    fetchTasks,
    selectTasksIdsForTodolist,
} from '@/features/todolists/model/tasksSlice';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';

export type FilterValue = 'all' | 'active' | 'completed';

type Props = {
    disabled: boolean;
    todolistId: string;
};

export const Tasks = (props: Props) => {
    console.log('rendering tasks');
    const { disabled, todolistId } = props;

    const dispatch = useAppDispatch();

    const tasks = useAppSelector(
        (state) => selectTasksIdsForTodolist(state, todolistId),
        shallowEqual,
    );

    const [paginationPage, setPaginationPage] = useState<number>(1);
    const [filterValue, setFilterValue] = useState<FilterValue>('all');
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        dispatch(fetchTasks(todolistId)).finally(() => setLoadingTasks(false));
    }, [dispatch, todolistId]);

    let content;

    if (loadingTasks) {
        content = <Loader />;
    } else if (tasks.length === 0) {
        content = <p>You dont have any tasks in this todolist yet!</p>;
    } else {
        content = tasks.map((tId) => {
            return <Task key={tId} taskId={tId} disabled={disabled} />;
        });
    }

    return (
        <div style={{ border: '2px solid blue' }}>
            {content}
            <TasksPagination
                disabled={disabled}
                paginationPage={paginationPage}
            />
            <FilterButtons disabled={disabled} filterValue={filterValue} />
        </div>
    );
};
