import { AddItemForm } from '../AddItemForm/AddItemForm';

export const EditableSpan = () => {
    const editing = false;
    return editing ? <AddItemForm /> : <span>edit me!</span>;
};
