import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Loader } from '@/common/components/Loader/Loader';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import {
    addTask,
    selectTasksIdsForTodolist,
} from '@/features/todolists/model/tasksSlice';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';
import type { FilterValue } from '@/features/todolists/utils/types/todolist.types';

type TasksStatus = 'idle' | 'loading' | 'success' | 'failure';

type Props = {
    disabled: boolean;
    todolistId: string;
};

export const Tasks = (props: Props) => {
    const { disabled, todolistId } = props;

    const dispatch = useAppDispatch();

    const [tasksStatus, setTaskStatus] = useState<TasksStatus>('idle');
    const [paginationPage, setPaginationPage] = useState<number>(1);
    const [filterValue, setFilterValue] = useState<FilterValue>('all');

    const taskIds = useAppSelector(
        (state) => selectTasksIdsForTodolist(state, todolistId, filterValue),
        shallowEqual,
    );

    const addTaskCallBack = (title: string) => {
        setTaskStatus('loading');
        dispatch(addTask({ todolistId, title }))
            .unwrap()
            .then(() => setTaskStatus('success'))
            .catch(() => setTaskStatus('failure'));
    };

    const changeFilterValue = (nextFilterValue: FilterValue) => {
        setFilterValue(nextFilterValue);
    };

    let content;

    if (taskIds.length > 0) {
        content = (
            <>
                {tasksStatus === 'loading' && <Loader />}
                <ul>
                    {taskIds.map((tId) => {
                        return (
                            <Task key={tId} taskId={tId} disabled={disabled} />
                        );
                    })}
                </ul>
            </>
        );
    } else if (tasksStatus === 'loading') {
        content = <Loader />;
    } else {
        content = <p>You dont have any tasks in this todolist yet!</p>;
    }

    return (
        <div style={{ border: '2px solid blue' }}>
            <AddItemForm onAddItem={addTaskCallBack} disabled={disabled} />
            {content}
            <TasksPagination
                disabled={disabled}
                paginationPage={paginationPage}
            />
            <FilterButtons
                disabled={disabled}
                filterValue={filterValue}
                onFilterValueChange={changeFilterValue}
            />
        </div>
    );
};
