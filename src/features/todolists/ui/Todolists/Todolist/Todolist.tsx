import {
    todolistsApi,
    useRemoveTodolistMutation,
    useUpdateTodolistMutation,
} from '@/features/api/todolistsApi';
import type { Todolist as TodolistType } from '@/features/todolists/utils/types/todolist.types';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';

type Props = {
    todolist: TodolistType;
};

enum TodolistStatus {
    IDLE = 'idle',
    UPDATING = 'updating',
    DELETING = 'deleting',
}

export const Todolist = (props: Props) => {
    const {
        todolist: { title, id: todolistId },
    } = props;

    const dispatch = useAppDispatch();

    const [todolistStatus, setTodolistStatus] = useState(TodolistStatus.IDLE);

    const [removeTodolist] = useRemoveTodolistMutation();
    const [updateTodolist] = useUpdateTodolistMutation();

    const deleteTodo = async () => {
        setTodolistStatus(TodolistStatus.DELETING);
        await removeTodolist(todolistId);
        dispatch(todolistsApi.endpoints.fetchTodolists.initiate())
            .unwrap()
            .then(
                () => {},
                () => {
                    setTodolistStatus(TodolistStatus.IDLE);
                },
            );
    };

    const updateTodo = async (title: string) => {
        setTodolistStatus(TodolistStatus.UPDATING);
        await updateTodolist({ todolistId, title });
        dispatch(todolistsApi.endpoints.fetchTodolists.initiate())
            .unwrap()
            .then(() => {
                setTodolistStatus(TodolistStatus.IDLE);
            });
    };

    const deletingTodolist = todolistStatus === TodolistStatus.DELETING;
    const updatingOrDeleting =
        deletingTodolist || todolistStatus === TodolistStatus.UPDATING;

    return (
        <Paper sx={{ padding: 2, height: 'min-content' }} elevation={3}>
            <TodolistTitle
                title={title}
                disabled={updatingOrDeleting}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
            />
            <Tasks disabled={deletingTodolist} todolistId={todolistId} />
        </Paper>
    );
};
