import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import {
    removeTodolist,
    updateTodolist,
} from '@/features/todolists/model/todolistSlice';

type Props = {
    disabled: boolean;
    title: string;
    todolistId: string;
};

export const TodolistTitle = (props: Props) => {
    const { disabled, title, todolistId } = props;

    const dispatch = useAppDispatch();

    const deleteTodo = () => {
        dispatch(removeTodolist(todolistId));
    };

    const updateTodo = (title: string) => {
        dispatch(updateTodolist({ todolistId, title }));
    };

    return (
        <div>
            <EditableSpan onEdit={updateTodo} spanText={title} />
            <button disabled={disabled} onClick={deleteTodo}>
                x
            </button>
        </div>
    );
};
