import {
    useRemoveTodolistMutation,
    useUpdateTodolistMutation,
} from '@/features/api/todolistsApi';
import { Todolist as TodolistType } from '@/features/todolists/utils/types/todolist.types';
import Paper from '@mui/material/Paper';
import { Tasks } from './Tasks/Tasks';
import { TodolistTitle } from './TodolistTitle/TodolistTitle';

type Props = {
    todolist: TodolistType;
};

export const Todolist = (props: Props) => {
    const {
        todolist: { title, id: todolistId },
    } = props;

    const [removeTodolist] = useRemoveTodolistMutation();
    const [updateTodolist] = useUpdateTodolistMutation();

    const deleteTodo = () => {
        removeTodolist(todolistId);
    };

    const updateTodo = (title: string) => {
        updateTodolist({ todolistId, title });
    };

    return (
        <Paper sx={{ padding: 2, height: 'min-content' }} elevation={3}>
            <TodolistTitle
                title={title}
                // disabled={deletingTodolist || changingTodolistTitle}
                disabled={false}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
            />
            {/* <Tasks disabled={deletingTodolist} todolistId={todolistId} /> */}
            <Tasks disabled={false} todolistId={todolistId} />
        </Paper>
    );
};
