import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectById } from '@/features/todolists/model/todolistSlice';
import { memo, useState } from 'react';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';

export type TodolistStatus = 'idle' | 'updating' | 'deleting';

type Props = {
    todolistId: string;
};

export const Todolist = memo(function Todolist(props: Props) {
    const { todolistId } = props;

    const todolist = useAppSelector((state) => selectById(state, todolistId));

    const { title } = todolist;

    const [todolistStatus, setTodolistStatus] =
        useState<TodolistStatus>('idle');

    const deletingTodolist = todolistStatus === 'deleting';
    const changingTodolistTitle = todolistStatus === 'updating';

    return (
        <div style={{ border: '2px solid black' }}>
            <TodolistTitle
                todolistId={todolistId}
                title={title}
                disabled={deletingTodolist || changingTodolistTitle}
                onSetTodolistStatus={setTodolistStatus}
            />
            <Tasks disabled={deletingTodolist} todolistId={todolistId} />
        </div>
    );
});
