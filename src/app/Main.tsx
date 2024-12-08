import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { addTodolist } from '@/features/todolists/model/todolistSlice';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';
import s from './Main.module.css';
import { Container } from '@/common/components/Container/Container';

export const Main = () => {
    const dispatch = useAppDispatch();

    const addTodo = (todolistTitle: string) => {
        dispatch(addTodolist(todolistTitle));
    };

    return (
        <Container className={s.container}>
            <AddItemForm placeholder={'Todolist title'} onAddItem={addTodo} />
            <Todolists />
        </Container>
    );
};
