import { useState } from 'react';
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';

export type FilterValue = 'all' | 'active' | 'completed';

type Props = {
    disabled: boolean;
};

export const Tasks = (props: Props) => {
    const { disabled } = props;

    const [paginationPage, setPaginationPage] = useState<number>(1);
    const [filterValue, setFilterValue] = useState<FilterValue>('all');

    return (
        <div style={{ border: '2px solid blue' }}>
            <Task disabled={disabled} />
            <Task disabled={disabled} />
            <Task disabled={disabled} />
            <Task disabled={disabled} />
            <TasksPagination
                disabled={disabled}
                paginationPage={paginationPage}
            />
            <FilterButtons disabled={disabled} filterValue={filterValue} />
        </div>
    );
};
