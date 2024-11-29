import { FilterButtons } from '../FilterButtons/FilterButtons';
import { TasksPagination } from '../TasksPagination/TasksPagination';
import { Task } from './Task/Task';

export const Tasks = () => {
    return (
        <div style={{ border: '2px solid blue' }}>
            <Task />
            <Task />
            <Task />
            <Task />
            <TasksPagination />
            <FilterButtons />
        </div>
    );
};
