import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { addTodolist } from '@/features/todolists/model/todolistSlice';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';
import Container from '@mui/material/Container';
import s from './Main.module.css';

export const Main = () => {
    const dispatch = useAppDispatch();

    const addTodo = (todolistTitle: string) => {
        dispatch(addTodolist(todolistTitle));
    };

    return (
        <section>
            <Container maxWidth={'xl'}>
                <AddItemForm
                    placeholder={'Todolist title'}
                    onAddItem={addTodo}
                    className={s.addItemForm}
                />
                <Todolists />
            </Container>
        </section>
    );
};
