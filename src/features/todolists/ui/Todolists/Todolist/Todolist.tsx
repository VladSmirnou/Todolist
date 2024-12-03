import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { addTask } from '@/features/todolists/model/tasksSlice';
import { selectById } from '@/features/todolists/model/todolistSlice';
import { useState } from 'react';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';

type TodolistStatus = 'idle' | 'deleting';

type Props = {
    todolistId: string;
};

export const Todolist = (props: Props) => {
    const { todolistId } = props;

    const dispatch = useAppDispatch();

    const todolist = useAppSelector((state) => selectById(state, todolistId));

    const { title } = todolist;

    const [todolistStatus, setTodolistStatus] =
        useState<TodolistStatus>('idle');

    const activeElementsDisabled = todolistStatus === 'deleting';

    const addTaskCallBack = (title: string) => {
        dispatch(addTask({ todolistId, title }));
    };

    return (
        <div style={{ border: '2px solid black' }}>
            <TodolistTitle
                todolistId={todolistId}
                title={title}
                disabled={activeElementsDisabled}
            />
            <AddItemForm
                onAddItem={addTaskCallBack}
                disabled={activeElementsDisabled}
            />
            <Tasks disabled={activeElementsDisabled} todolistId={todolistId} />
        </div>
    );
};
