import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Loader } from '@/common/components/Loader/Loader';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import {
    addTask,
    fetchTasks,
    removeLocalTask,
    removeTasks,
    selectFilteredTaskIdsForTodolist,
    selectTasksCount,
    selectTasksForTodolist,
} from '@/features/todolists/model/tasksSlice';
import type { FilterValue } from '@/features/todolists/utils/types/todolist.types';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';

type TasksStatus = 'idle' | 'loading' | 'success' | 'failure';

type Props = {
    disabled: boolean;
    todolistId: string;
};

const TASKS_PER_PAGE = 5;

export const Tasks = (props: Props) => {
    const { disabled, todolistId } = props;

    const dispatch = useAppDispatch();

    const [tasksStatus, setTaskStatus] = useState<TasksStatus>('idle');
    const [paginationPage, setPaginationPage] = useState<number>(1);
    const [filterValue, setFilterValue] = useState<FilterValue>('all');

    const tasksCount = useAppSelector((state) =>
        selectTasksCount(state.todolistEntities, todolistId),
    );

    const taskIds = useAppSelector(
        (state) => selectTasksForTodolist(state, todolistId),
        shallowEqual,
    );

    const filteredTaskIds = useAppSelector(
        (state) =>
            selectFilteredTaskIdsForTodolist(state, filterValue, todolistId),
        shallowEqual,
    );

    const amountOfPages = Math.ceil(tasksCount / TASKS_PER_PAGE);

    const handleSetPaginationPage = (nextPage: number) => {
        if (nextPage === paginationPage) {
            return;
        }
        setFilterValue('all');
        setTaskStatus('loading');
        setPaginationPage(nextPage);
        dispatch(removeTasks(taskIds));
        dispatch(
            fetchTasks({
                todolistId,
                count: TASKS_PER_PAGE,
                page: nextPage,
            }),
        ).finally(() => setTaskStatus('idle'));
    };

    const addTaskCallBack = (title: string) => {
        // set new tasks and remove a local task with the biggest order
        // which is always the first task in the sorted by order array
        setTaskStatus('loading');
        dispatch(addTask({ todolistId, title }))
            .unwrap()
            .then(() => {
                return dispatch(
                    fetchTasks({
                        todolistId,
                        count: TASKS_PER_PAGE,
                        page: paginationPage,
                    }),
                )
                    .unwrap()
                    .then(() => {
                        if (taskIds.length === TASKS_PER_PAGE) {
                            dispatch(removeLocalTask(taskIds.at(0)!));
                        }
                        setTaskStatus('success');
                    });
            })
            .catch(() => setTaskStatus('failure'));
    };

    const changeFilterValue = (nextFilterValue: FilterValue) => {
        setFilterValue(nextFilterValue);
    };

    let content;

    if (filteredTaskIds.length > 0) {
        content = (
            <>
                {tasksStatus === 'loading' && <Loader />}
                <ul>
                    {filteredTaskIds.map((tId) => {
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
            {tasksCount ?
                <TasksPagination
                    disabled={disabled}
                    paginationPage={paginationPage}
                    amountOfPages={amountOfPages}
                    onSetPaginationPage={handleSetPaginationPage}
                />
            :   null}
            <FilterButtons
                disabled={disabled}
                filterValue={filterValue}
                onFilterValueChange={changeFilterValue}
            />
        </div>
    );
};
