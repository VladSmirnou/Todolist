import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import { Tasks } from './Tasks/Tasks';

export const Todolist = () => {
    return (
        <div style={{ border: '2px solid black' }}>
            <TodolistTitle />
            <AddItemForm />
            <Tasks />
        </div>
    );
};
