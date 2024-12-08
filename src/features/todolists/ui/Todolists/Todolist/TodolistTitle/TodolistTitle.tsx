import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import {
    removeTodolist,
    updateTodolist,
} from '@/features/todolists/model/todolistSlice';
import type { TodolistStatus } from '../Todolist';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import s from './TodolistTitle.module.css';

type Props = {
    disabled: boolean;
    title: string;
    todolistId: string;
    onSetTodolistStatus: (nextStatus: TodolistStatus) => void;
};

export const TodolistTitle = (props: Props) => {
    const { disabled, title, todolistId, onSetTodolistStatus } = props;

    const dispatch = useAppDispatch();

    const deleteTodo = () => {
        onSetTodolistStatus('deleting');
        dispatch(removeTodolist(todolistId)).finally(() =>
            onSetTodolistStatus('idle'),
        );
    };

    const updateTodo = (title: string) => {
        onSetTodolistStatus('updating');
        dispatch(updateTodolist({ todolistId, title })).finally(() =>
            onSetTodolistStatus('idle'),
        );
    };

    return (
        <div className={s.container}>
            <EditableSpan
                onEdit={updateTodo}
                spanText={title}
                disabled={disabled}
                className={disabled ? s.taskTitleDisabled : undefined}
                component={'h3'}
                variant={'h5'}
            />
            <IconButton
                disabled={disabled}
                onClick={deleteTodo}
                aria-label="delete"
                size="medium"
            >
                <DeleteIcon fontSize="inherit" />
            </IconButton>
        </div>
    );
};
