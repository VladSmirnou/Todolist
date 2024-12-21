import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { AppStatus } from '@/common/enums/enums';
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
    selectTasksStatus,
    tasksStatusChanged,
} from '@/features/todolists/model/tasksSlice';
import {
    paginationPageChanged,
    selectPaginationPage,
    selectTasksCountForTodolistOnServer,
} from '@/features/todolists/model/todolistSlice';
import { TASKS_PER_PAGE } from '@/features/todolists/utils/constants/constants';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { TaskSkeleton } from './Skeletons/Skeleton/Skeleton';
import { TasksSkeletons } from './Skeletons/Skeletons';
import { Task } from './Task/Task';
import s from './Tasks.module.css';
import {
    FilterValue,
    TasksStatus,
} from '@/features/todolists/utils/enums/enums';

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

    const tasksStatus = useAppSelector((state) =>
        selectTasksStatus(state.todolistEntities, todolistId),
    );

    const [filterValue, setFilterValue] = useState<FilterValue>(
        FilterValue.ALL,
    );

    const tasksCountForTodolistOnServer = useAppSelector((state) =>
        selectTasksCountForTodolistOnServer(state.todolistEntities, todolistId),
    );

    const taskIds = useAppSelector(
        (state) => selectTaskIdsForTodolist(state, todolistId),
        shallowEqual,
    );

    let filteredTaskIds = useAppSelector(
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
        dispatch(
            tasksStatusChanged({
                todolistId,
                nextTasksStatus: TasksStatus.INITIAL_LOADING,
            }),
        );
        dispatch(
            fetchTasks({
                todolistId,
                count: TASKS_PER_PAGE,
                page: nextPage,
            }),
        )
            .unwrap()
            .then(() => {
                setFilterValue(FilterValue.ALL);
                dispatch(removeLocalTasks(taskIds));
                dispatch(paginationPageChanged({ todolistId, nextPage }));
            })
            .catch((error: string) => {
                dispatchAppStatusData(dispatch, AppStatus.FAILED, error);
            });
    };

    const addTaskCallBack = async (title: string) => {
        dispatch(
            tasksStatusChanged({
                todolistId,
                nextTasksStatus: TasksStatus.LOADING,
            }),
        );
        try {
            await dispatch(addTask({ todolistId, title })).unwrap();
        } catch {
            dispatch(
                tasksStatusChanged({
                    todolistId,
                    nextTasksStatus: TasksStatus.FAILURE,
                }),
            );
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
            dispatch(
                tasksStatusChanged({
                    todolistId,
                    nextTasksStatus: TasksStatus.SUCCESS,
                }),
            );
            dispatchAppStatusData(
                dispatch,
                AppStatus.SUCCEEDED,
                'Task was successfully added',
            );
        } catch {
            dispatch(
                tasksStatusChanged({
                    todolistId,
                    nextTasksStatus: TasksStatus.FAILURE,
                }),
            );
        }
    };

    const changeFilterValue = (nextFilterValue: FilterValue) => {
        setFilterValue(nextFilterValue);
    };

    if (
        tasksStatus === TasksStatus.LOADING &&
        filteredTaskIds.length === TASKS_PER_PAGE
    ) {
        filteredTaskIds = filteredTaskIds.slice(0, TASKS_PER_PAGE - 1);
    }

    const JSXTasks = filteredTaskIds.map((tId) => {
        return (
            <Task
                key={tId}
                taskId={tId}
                disabled={disabled}
                page={paginationPage}
            />
        );
    });

    let content;

    if (tasksStatus === TasksStatus.INITIAL_LOADING) {
        content = <TasksSkeletons />;
    } else if (filteredTaskIds.length > 0) {
        content = (
            <>
                {tasksStatus === TasksStatus.LOADING && <TaskSkeleton />}
                <ul className={s.tasksList}>{JSXTasks}</ul>
            </>
        );
    } else if (tasksStatus === TasksStatus.LOADING) {
        content = <TaskSkeleton />;
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
                disabled={
                    disabled ||
                    tasksStatus === TasksStatus.DELETING_TASK ||
                    tasksStatus === TasksStatus.LOADING
                }
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
