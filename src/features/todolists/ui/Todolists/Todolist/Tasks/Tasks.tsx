import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { TaskStatusCodes } from '@/common/enums/enums';
import {
    useAddTaskMutation,
    useFetchTasksQuery,
} from '@/features/api/tasksApi';
import {
    INITIAL_PAGE,
    TASKS_PER_PAGE,
} from '@/features/todolists/utils/constants/constants';
import { FilterValue } from '@/features/todolists/utils/enums/enums';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { TasksSkeletons } from './Skeletons/Skeletons';
import { Task } from './Task/Task';
import s from './Tasks.module.css';

type Props = {
    disabled: boolean;
    todolistId: string;
};

export const Tasks = (props: Props) => {
    const { disabled, todolistId } = props;

    const [paginationPage, setPaginationPage] = useState(INITIAL_PAGE);

    const {
        data: tasksData,
        isLoading,
        isSuccess,
    } = useFetchTasksQuery({
        todolistId,
        params: { count: TASKS_PER_PAGE, page: paginationPage },
    });

    const [addTask] = useAddTaskMutation();

    const [filterValue, setFilterValue] = useState<FilterValue>(
        FilterValue.ALL,
    );

    const handleSetPaginationPage = (nextPage: number) => {
        if (paginationPage !== nextPage) {
            setPaginationPage(nextPage);
        }
    };

    const addTaskCallBack = (title: string) => {
        addTask({ todolistId, title });
    };

    const changeFilterValue = (nextFilterValue: FilterValue) => {
        setFilterValue(nextFilterValue);
    };

    let content;
    let pagination;

    if (isLoading) {
        // Когда новый тудулист добалвяется, это будет всплывать постоянно,
        // т.к. такой query еще небыло
        content = <TasksSkeletons />;
    } else if (isSuccess) {
        const { items: tasks, totalCount } = tasksData;

        let finalTasks = tasks;
        if (filterValue !== FilterValue.ALL) {
            finalTasks = tasks.filter(
                (task) =>
                    (filterValue === FilterValue.ACTIVE &&
                        task.status === TaskStatusCodes.New) ||
                    (filterValue === FilterValue.COMPLETED &&
                        task.status === TaskStatusCodes.Completed),
            );
        }
        const amountOfPages = getAmountOfPages(totalCount, TASKS_PER_PAGE);

        if (totalCount > 0) {
            pagination = (
                <TasksPagination
                    disabled={disabled}
                    paginationPage={paginationPage}
                    amountOfPages={amountOfPages}
                    onSetPaginationPage={handleSetPaginationPage}
                />
            );
        }

        const JSXTasks = finalTasks.map((task) => {
            return (
                <Task
                    key={task.id}
                    paginationPage={paginationPage}
                    task={task}
                    disabled={disabled}
                />
            );
        });
        if (finalTasks.length > 0) {
            content = <ul className={s.tasksList}>{JSXTasks}</ul>;
        } else {
            content = (
                <Typography>
                    You dont have any tasks in this todolist yet!
                </Typography>
            );
        }
    }

    return (
        <>
            <AddItemForm
                onAddItem={addTaskCallBack}
                disabled={disabled}
                placeholder={'Task title'}
            />
            <div className={s.container}>{content}</div>
            {pagination}
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
