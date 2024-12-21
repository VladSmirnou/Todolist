import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectById } from '@/features/todolists/model/todolistSlice';
import { memo, useState } from 'react';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import Paper from '@mui/material/Paper';
import { TodolistStatus } from '@/features/todolists/utils/enums/enums';

type Props = {
    todolistId: string;
};

export const Todolist = memo(function Todolist(props: Props) {
    const { todolistId } = props;

    const todolist = useAppSelector((state) => selectById(state, todolistId));

    const { title } = todolist;

    const [todolistStatus, setTodolistStatus] = useState<TodolistStatus>(
        TodolistStatus.IDLE,
    );

    const deletingTodolist = todolistStatus === TodolistStatus.DELETING;
    const changingTodolistTitle = todolistStatus === TodolistStatus.UPDATING;

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
