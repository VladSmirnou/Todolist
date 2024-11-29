import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Todolist } from './Todolist/Todolist';

export const Todolists = () => {
    return (
        <div style={{ backgroundColor: 'pink' }}>
            <AddItemForm />
            <Todolist />
            <Todolist />
            <Todolist />
        </div>
    );
};
