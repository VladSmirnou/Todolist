import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Container } from '@/common/components/Container/Container';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useAddTodolistMutation } from '@/features/api/todolistsApi';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';
import s from './Main.module.css';

export const Main = () => {
    const [addTodolist] = useAddTodolistMutation();

    const addTodo = (todolistTitle: string) => {
        addTodolist(todolistTitle);
        // .unwrap()
        // .then(() => {
        //     dispatchAppStatusData(
        //         dispatch,
        //         AppStatus.SUCCEEDED,
        //         'Todolist was successfully added',
        //     );
        // });
    };

    return (
        <Container className={s.container}>
            <AddItemForm placeholder={'Todolist title'} onAddItem={addTodo} />
            <Todolists />
            <MessagePopup />
        </Container>
    );
};
