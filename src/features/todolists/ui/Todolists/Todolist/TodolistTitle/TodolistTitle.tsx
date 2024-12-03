import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import {
    removeTodolist,
    updateTodolist,
} from '@/features/todolists/model/todolistSlice';
import type { TodolistStatus } from '../Todolist';

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
        <div>
            <EditableSpan
                onEdit={updateTodo}
                spanText={title}
                disabled={disabled}
            />
            <button disabled={disabled} onClick={deleteTodo}>
                x
            </button>
        </div>
    );
};
