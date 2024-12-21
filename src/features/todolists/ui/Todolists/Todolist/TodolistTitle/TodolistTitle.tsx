import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import {
    removeTodolist,
    updateTodolist,
} from '@/features/todolists/model/todolistSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import s from './TodolistTitle.module.css';
import { TodolistStatus } from '@/features/todolists/utils/enums/enums';

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
        onSetTodolistStatus(TodolistStatus.DELETING);
        dispatch(removeTodolist(todolistId)).finally(() =>
            onSetTodolistStatus(TodolistStatus.IDLE),
        );
    };

    const updateTodo = (title: string) => {
        onSetTodolistStatus(TodolistStatus.UPDATING);
        dispatch(updateTodolist({ todolistId, title })).finally(() =>
            onSetTodolistStatus(TodolistStatus.IDLE),
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
