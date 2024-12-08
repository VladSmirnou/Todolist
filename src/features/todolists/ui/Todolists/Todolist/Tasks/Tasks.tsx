import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Loader } from '@/common/components/Loader/Loader';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import {
    addTask,
    fetchTasks,
    removeLocalOldestTaskForTodolist,
    removeLocalTasks,
    selectFilteredTaskIds,
    selectTaskIdsForTodolist,
} from '@/features/todolists/model/tasksSlice';
import {
    paginationPageChanged,
    selectPaginationPage,
    selectTasksCountForTodolistOnServer,
} from '@/features/todolists/model/todolistSlice';
import { TASKS_PER_PAGE } from '@/features/todolists/utils/constants/constants';
import type { FilterValue } from '@/features/todolists/utils/types/todolist.types';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';
import s from './Tasks.module.css';
import Typography from '@mui/material/Typography';

type TasksStatus = 'idle' | 'loading' | 'success' | 'failure';

type Props = {
    disabled: boolean;
    todolistId: string;
};

export const Tasks = (props: Props) => {
    const { disabled, todolistId } = props;

    const dispatch = useAppDispatch();

    const paginationPage = useAppSelector((state) =>
        selectPaginationPage(state.todolistEntities, todolistId),
    );

    const [tasksStatus, setTaskStatus] = useState<TasksStatus>('idle');
    const [filterValue, setFilterValue] = useState<FilterValue>('all');

    const tasksCountForTodolistOnServer = useAppSelector((state) =>
        selectTasksCountForTodolistOnServer(state.todolistEntities, todolistId),
    );

    const taskIds = useAppSelector(
        (state) => selectTaskIdsForTodolist(state, todolistId),
        shallowEqual,
    );

    const filteredTaskIds = useAppSelector(
        (state) => selectFilteredTaskIds(state, taskIds, filterValue),
        shallowEqual,
    );

    const amountOfPages = getAmountOfPages(
        tasksCountForTodolistOnServer,
        TASKS_PER_PAGE,
    );

    const handleSetPaginationPage = (nextPage: number) => {
        if (nextPage === paginationPage) {
            return;
        }
        setTaskStatus('loading');
        dispatch(
            fetchTasks({
                todolistId,
                count: TASKS_PER_PAGE,
                page: nextPage,
            }),
        )
            .unwrap()
            .then(() => {
                setTaskStatus('success');
                setFilterValue('all');
                dispatch(removeLocalTasks(taskIds));
                dispatch(paginationPageChanged({ todolistId, nextPage }));
            })
            .catch((error: string) => {
                dispatchAppStatusData(dispatch, 'failed', error);
                setTaskStatus('failure');
            });
    };

    const addTaskCallBack = async (title: string) => {
        setTaskStatus('loading');
        try {
            await dispatch(addTask({ todolistId, title })).unwrap();
        } catch {
            setTaskStatus('failure');
            return;
        }
        try {
            await dispatch(
                fetchTasks({
                    todolistId,
                    count: TASKS_PER_PAGE,
                    page: paginationPage,
                }),
            ).unwrap();
            if (taskIds.length === TASKS_PER_PAGE) {
                dispatch(removeLocalOldestTaskForTodolist(taskIds.at(-1)!));
            }
            setTaskStatus('success');
        } catch {
            setTaskStatus('failure');
        }
    };

    const changeFilterValue = (nextFilterValue: FilterValue) => {
        setFilterValue(nextFilterValue);
    };

    let content;

    if (filteredTaskIds.length > 0) {
        content = (
            <>
                {tasksStatus === 'loading' && <Loader />}
                <ul className={s.tasksList}>
                    {filteredTaskIds.map((tId) => {
                        return (
                            <Task
                                key={tId}
                                taskId={tId}
                                disabled={disabled}
                                page={paginationPage}
                            />
                        );
                    })}
                </ul>
            </>
        );
    } else if (tasksStatus === 'loading') {
        content = <Loader />;
    } else {
        content = (
            <Typography>
                You dont have any tasks in this todolist yet!
            </Typography>
        );
    }

    return (
        <>
            <AddItemForm
                onAddItem={addTaskCallBack}
                disabled={disabled}
                placeholder={'Task title'}
            />
            <div className={s.container}>{content}</div>
            {tasksCountForTodolistOnServer ?
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
        </>
    );
};

const getAmountOfPages = (
    tasksCountForTodolistOnServer: number,
    tasksPerPage: number,
) => {
    return Math.ceil(tasksCountForTodolistOnServer / tasksPerPage);
};
