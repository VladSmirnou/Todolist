import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import { Tasks } from './Tasks/Tasks';
import { useState } from 'react';

type TodolistStatus = 'idle' | 'deleting';

export const Todolist = () => {
    const [todolistStatus, setTodolistStatus] =
        useState<TodolistStatus>('idle');

    const activeElementsDisabled = todolistStatus === 'deleting';

    return (
        <div style={{ border: '2px solid black' }}>
            <TodolistTitle disabled={activeElementsDisabled} />
            <AddItemForm disabled={activeElementsDisabled} />
            <Tasks disabled={activeElementsDisabled} />
        </div>
    );
};
