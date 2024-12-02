import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import { Tasks } from './Tasks/Tasks';
import { useState } from 'react';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectById } from '@/features/todolists/model/todolistSlice';

type TodolistStatus = 'idle' | 'deleting';

type Props = {
    todolistId: string;
};

export const Todolist = (props: Props) => {
    const { todolistId } = props;

    const todolist = useAppSelector((state) => selectById(state, todolistId));

    const { title } = todolist;

    const [todolistStatus, setTodolistStatus] =
        useState<TodolistStatus>('idle');

    const activeElementsDisabled = todolistStatus === 'deleting';

    const addTask = (taskTitle: string) => {};

    return (
        <div style={{ border: '2px solid black' }}>
            <TodolistTitle
                todolistId={todolistId}
                title={title}
                disabled={activeElementsDisabled}
            />
            <AddItemForm
                onAddItem={addTask}
                disabled={activeElementsDisabled}
            />
            <Tasks disabled={activeElementsDisabled} />
        </div>
    );
};
