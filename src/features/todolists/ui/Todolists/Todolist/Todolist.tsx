import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectById } from '@/features/todolists/model/todolistSlice';
import { memo, useState } from 'react';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import Paper from '@mui/material/Paper';

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
        <Paper sx={{ padding: 2, height: 'min-content' }} elevation={3}>
            <TodolistTitle
                todolistId={todolistId}
                title={title}
                disabled={deletingTodolist || changingTodolistTitle}
                onSetTodolistStatus={setTodolistStatus}
            />
            <Tasks disabled={deletingTodolist} todolistId={todolistId} />
        </Paper>
    );
});
