import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { addTodolist } from '@/features/todolists/model/todolistSlice';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';

export const Main = () => {
    const dispatch = useAppDispatch();

    const addTodo = (todolistTitle: string) => {
        dispatch(addTodolist(todolistTitle));
    };

    return (
        <section style={{ backgroundColor: 'yellow' }}>
            <AddItemForm onAddItem={addTodo} />
            <Todolists />
        </section>
    );
};
